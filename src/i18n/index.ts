import commonFr from './common.fr';
import commonEn from './common.en';
import mbtiFr from './mbti.fr';
import mbtiEn from './mbti.en';
import questionsEn from './questions.en.json';
import questionsFr from './questions.fr.json';

export enum TranslatorLangs {
  FR = 'fr',
  EN = 'en',
}

export const i18nFlags: Record<TranslatorLangs, string> = {
  [TranslatorLangs.EN]: '🇺🇸',
  [TranslatorLangs.FR]: '🇫🇷',
};

interface Stringifiable {
  toString(): string;
}

interface TranslatorParam {
  [key: string]: Stringifiable | TranslatorParam;
}

type Translations = {
  [key in TranslatorLangs]: string | TranslatorParam;
};

class Translator {
  private translations: Translations;

  constructor() {
    this.translations = {
      [TranslatorLangs.FR]: {
        ...commonFr,
        ...mbtiFr,
        ...questionsFr,
      },
      [TranslatorLangs.EN]: {
        ...commonEn,
        ...mbtiEn,
        ...questionsEn,
      },
    };
  }

  private deepTrans(tree: string[], curr: string | TranslatorParam): string {
    if (typeof curr === 'string') return curr;

    const current = curr[tree.shift()];
    if (!tree.length) return current as string;

    return this.deepTrans(tree, current as TranslatorParam);
  }

  public t(locale: TranslatorLangs, key: string, params?: TranslatorParam): string {
    let translation = this.deepTrans(key.split('.'), this.translations[locale]);
    if (!params) return translation;

    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{:${param}}`, value.toString());
    });

    return translation;
  }
}

export const i18n = new Translator();
