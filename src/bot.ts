import { Client, ClientOptions } from 'discord.js';
import { ButtonHandlerValue } from 'handlers/button/button.interface';
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
        const operation: ButtonHandlerValue = JSON.parse(interaction.customId);
        commandButtonHandlers.get(operation.id)?.handle(interaction, operation);
      }
    });
  }
}
