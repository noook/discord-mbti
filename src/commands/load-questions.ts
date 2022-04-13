import { TranslatorLangs } from 'i18n';
import { Dichotomy } from 'types/mbti';
import { DeepPartial } from 'typeorm';
import { MbtiQuestion } from '../entity/MbtiQuestion';
import { AppDataSource } from '../data-source';
import { questions } from '../../resources/questions.json';

interface Question {
  label: {
    [Key in TranslatorLangs]: string;
  };
  value: Dichotomy;
}

const questionRepository = AppDataSource.getRepository(MbtiQuestion);

function generatePair(pair: [Question, Question], pairId: number): DeepPartial<MbtiQuestion>[] {
  return pair.reduce<DeepPartial<MbtiQuestion>[]>((collection, question) => {
    Object.keys(question.label).forEach((lang: TranslatorLangs) => {
      collection.push({
        pairId,
        lang,
        content: question.label[lang],
        value: question.value,
      });
    });
    return collection;
  }, []);
}

async function run() {
  await AppDataSource.initialize();
  await questionRepository.clear();

  const collection: DeepPartial<MbtiQuestion>[] = [];
  questions.forEach((pair: [Question, Question], idx) => {
    collection.push(...generatePair(pair, idx + 1));
  });
  await questionRepository.save(collection, {});
  process.exit();
}

run();
