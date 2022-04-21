import winston from 'winston';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export const currentRunInfoLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'info.txt',
      level: 'info',
      options: {
        flags: 'w',
      },
      format: winston.format.simple(),
    }),
  ],
});
