import { ButtonInteraction, CommandInteraction, Interaction } from 'discord.js';
import { shuffle } from '../helpers';
import { AppDataSource } from '../data-source';
import { DiscordUser, MbtiTest, MbtiAnswer } from '../entity';
import { BadInteractionException } from '../exceptions/BadInteractionException';

export class MbtiService {
  static TestLength = 44;

  private mbtiTestRepository = AppDataSource.getRepository(MbtiTest);

  private mbtiAnswerRepository = AppDataSource.getRepository(MbtiAnswer);

  public async resumeTest(interaction: Interaction, user: DiscordUser) {
    let test = await this.getCurrentTest(user);

    if (!test) {
      test = await this.createTest(user);
    }

    if (!(interaction.isCommand() || interaction.isButton())) {
      throw new BadInteractionException(interaction);
    }

    return this.askQuestion(interaction, test);
  }

  public getCurrentTest(user: DiscordUser): Promise<MbtiTest | null> {
    return this.mbtiTestRepository.findOne({
      where: {
        user,
        completed: false,
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

  public askQuestion(interaction: CommandInteraction | ButtonInteraction, test: MbtiTest): Promise<void> {
    return interaction.reply(`Let's start, step ${test.step} !`);
  }
}
