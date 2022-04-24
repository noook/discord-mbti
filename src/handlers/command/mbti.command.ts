import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { BadInteractionException } from '../../exceptions/BadInteractionException';
import { i18nFlags } from '../../i18n';
import { UserService } from '../../services/user.service';
import { CommandHandlerInterface } from './command.interface';
import { MbtiService } from '../../services/mbti.service';
import { logger } from '../../logger';

export default class MbtiCommandHandler implements CommandHandlerInterface {
  public commandName = 'mbti';

  private userService: UserService = new UserService();

  private mbtiService: MbtiService = new MbtiService();

  async handle(interaction: CommandInteraction): Promise<void> {
    const { user } = interaction;
    const discordUser = await this.userService.upsertUser(user);

    if (!discordUser.locale) {
      const locales = Object.entries(i18nFlags);
      const actions = new MessageActionRow().addComponents(
        locales.map(([key, flag]) => new MessageButton()
          .setCustomId(JSON.stringify({ id: 'setLocale', value: key }))
          .setLabel(flag)
          .setStyle('SECONDARY')),
      );

      interaction.reply({
        content: 'Just sent you a DM, check them !',
        ephemeral: true,
      });

      const dm = await interaction.user.createDM();
      dm.send({
        content: "We haven't met yet ! Which language would like to speak ?",
        components: [actions],
      });
    }
    try {
      return await this.mbtiService.resumeTest(interaction, discordUser);
    } catch (e) {
      if (e instanceof BadInteractionException) {
        logger.error(e.message, e.interaction.toJSON());
      }
      return undefined;
    }
  }
}
