import { ButtonInteraction } from 'discord.js';

export interface ButtonHandlerInterface<T extends ButtonHandlerValue = ButtonHandlerValue> {
  commandName: string;
  handle(interaction: ButtonInteraction, operation: T): void | Promise<void>
}

export interface ButtonHandlerValue {
  id: string;
  [key: string]: unknown;
}

interface CommandButtonHandlerConstructor {
  new(): ButtonHandlerInterface;
}

export function commandHandlerFactory(Ctor: CommandButtonHandlerConstructor) {
  return new Ctor();
}
