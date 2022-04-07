import { CommandInteraction } from 'discord.js';

export interface CommandHandlerInterface {
  commandName: string;
  handle(interaction: CommandInteraction): void | Promise<void>
}

interface CommandHandlerConstructor {
  new(): CommandHandlerInterface
}

export function commandHandlerFactory(Ctor: CommandHandlerConstructor) {
  return new Ctor();
}
