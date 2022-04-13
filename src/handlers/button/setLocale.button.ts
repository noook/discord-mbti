import { ButtonInteraction } from 'discord.js';
import { i18n, TranslatorLangs } from '../../i18n';
import { UserService } from '../../services/user.service';
import { ButtonHandlerInterface } from './button.interface';

export default class MbtiCommandHandler implements ButtonHandlerInterface<TranslatorLangs> {
  public commandName = 'setLocale';

  private userService: UserService = new UserService();

  async handle(interaction: ButtonInteraction, value: TranslatorLangs): Promise<void> {
    this.userService.setUserLocale(interaction.user, value);
    await interaction.reply(i18n.t(value, 'common.letstalkx'));
    await interaction.user.send('test');
  }
}
