import { ButtonInteraction } from 'discord.js';
import { MbtiService } from '../../services/mbti.service';
import { i18n, TranslatorLangs } from '../../i18n';
import { UserService } from '../../services/user.service';
import { ButtonHandlerInterface, ButtonHandlerValue } from './button.interface';
import { logger } from '../../logger';
import { BadInteractionException } from '../../exceptions/BadInteractionException';

interface SetLocaleHandlerValue extends ButtonHandlerValue {
  value: TranslatorLangs;
}
export default class SetLocaleButtonHandler implements ButtonHandlerInterface<SetLocaleHandlerValue> {
  public commandName = 'setLocale';

  private userService: UserService = new UserService();

  private mbtiService: MbtiService = new MbtiService();

  async handle(interaction: ButtonInteraction, operation: SetLocaleHandlerValue): Promise<void> {
    const discordUser = await this.userService.setUserLocale(interaction.user, operation.value);
    await interaction.reply(i18n.t(discordUser.locale, 'common.letstalkx'));
    try {
      await this.mbtiService.resumeTest(interaction, discordUser);
    } catch (e) {
      if (e instanceof BadInteractionException) {
        logger.error(e.message, e.interaction.toJSON());
      }
    }
  }
}
