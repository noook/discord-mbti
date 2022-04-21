import { AutoPoster } from 'topgg-autoposter';
import 'dotenv/config';
import { Intents } from 'discord.js';
import { Bot } from './bot';
import { AppDataSource } from './data-source';
import { logger, currentRunInfoLogger } from './logger';

// eslint-disable-next-line no-console
console.clear();
AppDataSource.initialize()
  .then(() => {
    logger.info('Successfully connected to the database');
  });

const bot = new Bot(process.env.DISCORD_TOKEN, {
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

bot.start();

const ap = AutoPoster(process.env.TOPGG_TOKEN, bot);
ap.on('posted', (e) => {
  currentRunInfoLogger.info(`Server count: ${e.serverCount}`);
  currentRunInfoLogger.info('Server count: AH?.');
});
