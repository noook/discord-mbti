import 'dotenv/config';
import { Intents } from 'discord.js';
import { Bot } from './bot';

const bot = new Bot(process.env.DISCORD_TOKEN, {
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

bot.start();
