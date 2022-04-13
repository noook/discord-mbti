import { Collection } from 'discord.js';
import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { commandHandlerFactory, ButtonHandlerInterface } from './button.interface';

export const commandButtonHandlers = new Collection<string, ButtonHandlerInterface>();

readdir(__dirname).then((files) => {
  files
    .filter((file) => file.match(/\.button\.(?:js|ts)/))
    .forEach(async (file) => {
      const CommandHandler = (await import(resolve(__dirname, file))).default;
      const handler: ButtonHandlerInterface = commandHandlerFactory(CommandHandler);
      commandButtonHandlers.set(handler.commandName, handler);
    });
});
