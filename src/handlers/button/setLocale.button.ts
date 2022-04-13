import { ButtonInteraction } from 'discord.js';
import { MbtiService } from '../../services/mbti.service';
import { i18n, TranslatorLangs } from '../../i18n';
import { UserService } from '../../services/user.service';
import { ButtonHandlerInterface } from './button.interface';
import { logger } from '../../logger';
import { BadInteractionException } from '../../exceptions/BadInteractionException';

export default class LetLocaleButtonHandler implements ButtonHandlerInterface<TranslatorLangs> {
  public commandName = 'setLocale';

  private userService: UserService = new UserService();

  private mbtiService: MbtiService = new MbtiService();

  async handle(interaction: ButtonInteraction, value: TranslatorLangs): Promise<void> {
    const discordUser = await this.userService.setUserLocale(interaction.user, value);
    await interaction.reply(i18n.t(value, 'common.letstalkx'));
    try {
      await this.mbtiService.resumeTest(interaction, discordUser);
    } catch (e) {
      if (e instanceof BadInteractionException) {
        logger.error(e.message, e.interaction.toJSON());
      }
    }
  }
}
