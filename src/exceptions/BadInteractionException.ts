import { Interaction } from 'discord.js';

export class BadInteractionException extends Error {
  public name = 'Bad interaction exception';

  public message = 'This interaction could not be handled';

  public constructor(public interaction: Interaction) {
    super();
  }
}
