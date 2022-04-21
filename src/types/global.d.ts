declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development';
    DISCORD_TOKEN: string;
    BOT_PREFIX: string;
    DB_DRIVER: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    TOPGG_TOKEN: string;
    BOT_CLIENT_ID: string;
  }
}
