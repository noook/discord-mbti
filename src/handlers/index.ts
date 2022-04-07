import { Collection } from 'discord.js';
import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { commandHandlerFactory, CommandHandlerInterface } from './command.interface';

export const commandHandlers = new Collection<string, CommandHandlerInterface>();

readdir(__dirname).then((files) => {
  files
    .filter((file) => file.match(/\.command\.(?:js|ts)/))
    .forEach(async (file) => {
      const CommandHandler = (await import(resolve(__dirname, file))).default;
      const handler: CommandHandlerInterface = commandHandlerFactory(CommandHandler);
      commandHandlers.set(handler.commandName, handler);
    });
});
