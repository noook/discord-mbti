import { ButtonInteraction } from 'discord.js';

export interface ButtonHandlerInterface<T = unknown> {
  commandName: string;
  handle(interaction: ButtonInteraction, value: T): void | Promise<void>
}

interface CommandButtonHandlerConstructor {
  new(): ButtonHandlerInterface;
}

export function commandHandlerFactory(Ctor: CommandButtonHandlerConstructor) {
  return new Ctor();
}
