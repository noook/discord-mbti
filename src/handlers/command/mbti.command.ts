import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { i18nFlags } from '../../i18n';
import { UserService } from '../../services/user.service';
import { logger } from '../../logger';
import { CommandHandlerInterface } from './command.interface';

export default class MbtiCommandHandler implements CommandHandlerInterface {
  public commandName = 'mbti';

  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async handle(interaction: CommandInteraction): Promise<void> {
    const { user } = interaction;
    const discordUser = await this.userService.upsertUser(user);

    if (!discordUser.locale) {
      const locales = Object.entries(i18nFlags);
      const actions = new MessageActionRow().addComponents(
        locales.map(([key, flag]) => new MessageButton().setCustomId(`setLocale=${key}`).setLabel(flag).setStyle('SECONDARY')),
      );

      return interaction.reply({
        content: "We haven't met yet ! Which language would like to speak ?",
        components: [actions],
      });
    }

    logger.debug(discordUser);
    return interaction.reply('ok');
  }
}
