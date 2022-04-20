import { ButtonInteraction } from 'discord.js';
import { MbtiService } from '../../services/mbti.service';
import { UserService } from '../../services/user.service';
import { ButtonHandlerInterface, ButtonHandlerValue } from './button.interface';
import { Dichotomy } from '../../types/mbti';
import { MbtiTest } from '../../entity';

export interface AnswerQuestionHandlerValue extends ButtonHandlerValue {
  value: Dichotomy;
  step: MbtiTest['step']
}
export default class AnswerQuestionButtonHandler implements ButtonHandlerInterface<AnswerQuestionHandlerValue> {
  public commandName = 'answerQuestion';

  private userService: UserService = new UserService();

  private mbtiService: MbtiService = new MbtiService();

  async handle(interaction: ButtonInteraction, operation: AnswerQuestionHandlerValue): Promise<void> {
    const discordUser = await this.userService.upsertUser(interaction.user);
    return this.mbtiService.answerQuestion(discordUser, interaction, operation.step, operation.value);
  }
}
