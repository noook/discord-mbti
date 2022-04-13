import { Client, ClientOptions } from 'discord.js';
import { logger } from './logger';
import { commandButtonHandlers, commandHandlers } from './handlers';

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
        commandHandlers.get(commandName)?.handle(interaction);
      } else if (interaction.isButton()) {
        const [operation, value] = interaction.customId.split('=');
        commandButtonHandlers.get(operation)?.handle(interaction, value);
      }
    });
  }
}
