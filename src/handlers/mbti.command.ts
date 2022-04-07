import { CommandInteraction } from 'discord.js';
import { CommandHandlerInterface } from './command.interface';

export default class MbtiCommandHandler implements CommandHandlerInterface {
  public commandName = 'mbti';

  handle(interaction: CommandInteraction): void | Promise<void> {
    interaction.reply('ok');
  }
}
