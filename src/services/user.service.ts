import { User } from 'discord.js';
import { DiscordUser } from '../entity';
import { AppDataSource } from '../data-source';

export class UserService {
  public async upsertUser(user: User): Promise<DiscordUser> {
    let discordUser: DiscordUser;

    try {
      discordUser = await AppDataSource.getRepository(DiscordUser).findOneOrFail({
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
}
