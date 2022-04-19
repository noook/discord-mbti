import {
  ButtonInteraction, CommandInteraction, Interaction, MessageActionRow, MessageButton, MessageEmbed,
} from 'discord.js';
import { FruitAction, FRUIT_ACTIONS } from '../types/mbti';
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
    return this.mbtiTestRepository.findOneBy({
      user: {
        id: user.id,
      },
      completed: false,
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
        test,
        value: null,
      },
      order: { step: 'ASC' },
    });
    const reactions = this.prepareReactions();
    const [first, last] = await this.findQuestion(nextAnswer.pairId, user.locale);
    const answersButtons = new MessageActionRow().addComponents(
      new MessageButton().setCustomId(first.value).setLabel(reactions[0]).setStyle('PRIMARY'),
      new MessageButton().setCustomId(last.value).setLabel(reactions[1]).setStyle('PRIMARY'),
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

    return interaction.reply({
      embeds: [msg],
      components: [answersButtons],
    });
  }
}
