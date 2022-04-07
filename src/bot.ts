import { Client, ClientOptions } from 'discord.js';
import { UserService } from './services/user.service';
import { logger } from './logger';
import { commandHandlers } from './handlers';
import { TranslatorLangs } from './i18n';

export class Bot extends Client {
  public constructor(token: string, options: ClientOptions) {
    super(options);
    this.token = token;
  }

  public async start() {
    this.login();
    this.greet();
    this.registerInteractions();
  }

  private greet() {
    this.on('ready', (client) => {
      logger.info(`Connected as ${client.user.tag}`);
    });
  }

  private registerInteractions() {
    this.on('interactionCreate', (interaction) => {
      if (interaction.isCommand()) {
        const { commandName } = interaction;
        const commandHandler = commandHandlers.get(commandName);

        if (commandHandler) {
          commandHandler.handle(interaction);
        }
      } else if (interaction.isButton()) {
        const [operation, value] = interaction.customId.split('=');
        console.log(operation, interaction.customId);

        if (operation === 'setLocale') {
          const locale: TranslatorLangs = value as TranslatorLangs;

          new UserService().setUserLocale(interaction.user, locale);
        }
        interaction.reply(`Ok, so it will be ${interaction.customId}`);
      }
    });
  }
}
