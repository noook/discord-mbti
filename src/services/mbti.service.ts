import { ButtonInteraction, CommandInteraction, Interaction } from 'discord.js';
import { AppDataSource } from '../data-source';
import { DiscordUser, MbtiTest } from '../entity';
import { BadInteractionException } from '../exceptions/BadInteractionException';

export class MbtiService {
  private mbtiTestRepository = AppDataSource.getRepository(MbtiTest);

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

  public createTest(user: DiscordUser): Promise<MbtiTest> {
    return this.mbtiTestRepository.save({
      user,
      step: 1,
    });
  }

  public askQuestion(interaction: CommandInteraction | ButtonInteraction, test: MbtiTest): Promise<void> {
    return interaction.reply(`Let's start, step ${test.step} !`);
  }
}
