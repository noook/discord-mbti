import {
  ButtonInteraction,
  CommandInteraction,
  Interaction,
  InteractionReplyOptions,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessagePayload,
} from 'discord.js';
import { AnswerQuestionHandlerValue } from 'handlers/button/answerQuestion.button';
import { IsNull } from 'typeorm';
import { logger } from '../logger';
import {
  Dichotomy, DichotomyRowCount, DICHOTOMY_COUPLES, FruitAction, FRUIT_ACTIONS,
} from '../types/mbti';
import { shuffle } from '../helpers';
import { AppDataSource } from '../data-source';
import {
  DiscordUser, MbtiTest, MbtiAnswer, MbtiQuestion,
} from '../entity';
import { BadInteractionException } from '../exceptions/BadInteractionException';
import { i18n, TranslatorLangs } from '../i18n';

export class MbtiService {
  static TestLength = 44;

  private mbtiTestRepository = AppDataSource.getRepository(MbtiTest);

  private mbtiAnswerRepository = AppDataSource.getRepository(MbtiAnswer);

  private mbtiQuestionRepository = AppDataSource.getRepository(MbtiQuestion);

  public async resumeTest(interaction: Interaction, user: DiscordUser) {
    let test = await this.getCurrentTest(user);

    if (!test) {
      test = await this.createTest(user);
    }

    if (!(interaction.isCommand() || interaction.isButton())) {
      throw new BadInteractionException(interaction);
    }

    return this.askQuestion(user, interaction, test);
  }

  public getCurrentTest(user: DiscordUser): Promise<MbtiTest | null> {
    return this.mbtiTestRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        completed: false,
      },
      relations: {
        user: true,
      },
    });
  }

  public async createTest(user: DiscordUser): Promise<MbtiTest> {
    const test = this.mbtiTestRepository.create({
      user,
      step: 1,
    });

    const answersIds = shuffle([...Array(MbtiService.TestLength)].map((_, idx) => idx + 1));
    const answers = this.mbtiAnswerRepository.create(answersIds.map((pairId, step) => ({
      pairId, step: step + 1,
    })));

    test.answers = answers;

    await this.mbtiTestRepository.save(test);

    return test;
  }

  private isPairComplete(pair: MbtiQuestion[]): pair is [MbtiQuestion, MbtiQuestion] {
    return pair.length === 2;
  }

  private async findQuestion(pairId: number, locale: TranslatorLangs): Promise<[MbtiQuestion, MbtiQuestion] | never> {
    const questions = await this.mbtiQuestionRepository.findBy({
      pairId,
      lang: locale,
    });

    if (this.isPairComplete(questions)) {
      return shuffle(questions);
    }

    throw new Error('Incorrect number of questions loaded');
  }

  private prepareReactions(): [FruitAction, FruitAction] {
    return shuffle(FRUIT_ACTIONS).slice(0, 2) as [FruitAction, FruitAction];
  }

  public async askQuestion(user: DiscordUser, interaction: CommandInteraction | ButtonInteraction, test: MbtiTest): Promise<void> {
    const nextAnswer = await this.mbtiAnswerRepository.findOne({
      where: {
        test: {
          id: test.id,
        },
        value: IsNull(),
      },
      order: { step: 'ASC' },
    });
    const reactions = this.prepareReactions();
    const [first, last] = await this.findQuestion(nextAnswer.pairId, user.locale);
    const commandId = 'answerQuestion';
    const answersButtons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(JSON.stringify({
          id: commandId,
          value: first.value,
          step: test.step,
        }))
        .setLabel(reactions[0])
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(JSON.stringify({
          id: commandId,
          value: last.value,
          step: test.step,
        }))
        .setLabel(reactions[1])
        .setStyle('PRIMARY'),
    );

    const msg = new MessageEmbed()
      .setTitle(
        i18n.t(user.locale, 'mbti.questionIndex', { current: test.step, total: MbtiService.TestLength }),
      )
      .addFields([
        { name: reactions[0], value: first.content },
        { name: reactions[1], value: last.content },
      ])
      .setColor('BLUE');

    const msgPayload: MessagePayload | InteractionReplyOptions = {
      embeds: [msg],
      components: [answersButtons],
    };

    const dm = await interaction.user.createDM();
    const collector = dm.createMessageComponentCollector({
      max: 1,
      filter: (i) => {
        const op: AnswerQuestionHandlerValue = JSON.parse(i.customId);
        return op.id === commandId && op.step === test.step;
      },
    });
    const channel = await interaction.client.channels.fetch(interaction.channelId, { cache: true });

    if (channel.type !== 'DM') {
      await interaction.reply({ content: i18n.t(user.locale, 'common.goDM'), ephemeral: true });
      const sentMsg = await dm.send(msgPayload);

      collector.on('end', (event) => {
        const i = event.first();
        sentMsg.edit({ embeds: i.message.embeds, components: [] });
      });
    } else {
      await interaction.reply(msgPayload);
      collector.on('end', (event) => {
        const i = event.first();
        interaction.editReply({ embeds: i.message.embeds, components: [] });
      });
    }
  }

  public async answerQuestion(discordUser: DiscordUser, interaction: ButtonInteraction, step: number, value: Dichotomy) {
    const test = await this.getCurrentTest(discordUser);
    if (test === null) {
      logger.error(`Test not found for user ${discordUser.tag}`);
      return interaction.reply('Sorry, an error occurred');
    }

    if (test.step !== step) {
      logger.error(`Attempt to answer wrong question (current: ${test.step}, received: ${step})`);
      return interaction.reply(i18n.t(discordUser.locale, 'common.replyToLatest'));
    }

    const answer = await this.mbtiAnswerRepository.findOneBy({
      step,
      test: {
        id: test.id,
      },
    });

    answer.value = value;
    await this.mbtiAnswerRepository.save(answer);
    if (test.step === MbtiService.TestLength) {
      return this.completeTest(interaction, test);
    }

    test.step += 1;
    await this.mbtiTestRepository.save(test);

    return this.askQuestion(discordUser, interaction, test);
  }

  private async completeTest(interaction: ButtonInteraction, test: MbtiTest) {
    test.completed = true;
    test.completedAt = new Date();
    const results = await this.getResults(test);
    results.forEach((entry) => {
      test[entry.value] = entry.count;
    });
    test.result = this.calculateResults(test);
    await this.mbtiTestRepository.save(test);

    return interaction.reply([
      i18n.t(test.user.locale, 'mbti.typeResult', { type: test.result }),
      i18n.t(test.user.locale, 'mbti.akaBase', { alias: i18n.t(test.user.locale, `mbti.typeAka.${test.result}`) }),
      i18n.t(test.user.locale, `mbti.summaries.${test.result}`),
      i18n.t(test.user.locale, 'mbti.detailLink', { type: test.result }),
    ].join('\n\n'));
  }

  private getResults(test: MbtiTest): Promise<DichotomyRowCount[]> {
    return this.mbtiAnswerRepository
      .createQueryBuilder('a')
      .select('a.value', 'value')
      .addSelect('COUNT(*)::int', 'count')
      .andWhere('a.test = :testId', { testId: test.id })
      .groupBy('a.value')
      .getRawMany();
  }

  private calculateResults(test: MbtiTest): string {
    return [...DICHOTOMY_COUPLES].reduce((result, pair) => result + pair.sort((a, b) => test[a] - test[b]).pop(), '');
  }
}
