import 'dotenv/config';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { logger } from '../logger';

const commands = [
  new SlashCommandBuilder().setName('mbti').setDescription('Starts or resumes a MBTI quiz'),
]
  .map((command) => command.toJSON());

const rest = new REST({ version: '9' })
  .setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID), { body: commands })
  .then(() => logger.info(`Sucessfully registered ${commands.length} commands`))
  .catch(console.error);
