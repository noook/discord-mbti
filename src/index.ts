import { AutoPoster } from 'topgg-autoposter';
import { writeFile } from 'node:fs';
import 'dotenv/config';
import { Intents } from 'discord.js';
import { Bot } from './bot';
import { AppDataSource } from './data-source';
import { logger } from './logger';

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
  writeFile('info.txt', `Server count: ${e.serverCount}`, {
    encoding: 'utf8',
  }, (err) => err && logger.error(err.message));
});
