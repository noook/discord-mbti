import { User } from 'discord.js';
import { Repository } from 'typeorm';
import { TranslatorLangs } from '../i18n';
import { DiscordUser } from '../entity';
import { AppDataSource } from '../data-source';

export class UserService {
  private discordUserRepository: Repository<DiscordUser> = AppDataSource.manager.getRepository(DiscordUser);

  public async upsertUser(user: User): Promise<DiscordUser> {
    let discordUser: DiscordUser;

    try {
      discordUser = await this.discordUserRepository.findOneOrFail({
        where: {
          discordId: user.id,
        },
      });
      discordUser.lastActive = new Date();
    } catch (e) {
      discordUser = new DiscordUser();
      discordUser.discordId = user.id;
      discordUser.tag = user.tag;
    } finally {
      AppDataSource.manager.save(discordUser);
    }

    return discordUser;
  }

  public async setUserLocale(user: User, locale: TranslatorLangs): Promise<DiscordUser> {
    const discordUser = await this.discordUserRepository.findOne({
      where: {
        discordId: user.id,
      },
    });

    discordUser.locale = locale;

    return AppDataSource.manager.save(discordUser);
  }
}
