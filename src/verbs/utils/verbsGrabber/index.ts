import { JSDOM } from 'jsdom';
import { verbsConfigByTitles } from './verbsConfig';

// TODO: types
type WordItem = Record<string, string[]>;

// TODO: types
interface TensesData {
  wordId: string;
  data: any; // TODO: types
}

const getVerbData = async (verb: string) => {
  const url = encodeURI(
    `https://glagol.reverso.net/спряжение-испанский-глагол-${verb}.html`,
  ).trim();

  const result: WordItem = {};

  const dom = await JSDOM.fromURL(url);

  const blocks = dom.window.document.querySelectorAll(
    '.result-block-api .blue-box-wrap',
  );

  blocks.forEach((block) => {
    const title = block.getAttribute('mobile-title')?.trim();
    const config = verbsConfigByTitles[title ?? ''];

    if (!title || !config) {
      return;
    }

    const valueNodes = block.querySelectorAll('li .verbtxt');

    const values = [...(valueNodes as any)].map((node) => node.innerHTML);

    const isCorrect = values.every(Boolean);

    if (isCorrect) {
      result[config.key] = values;
    }
  });

  return result;
};

interface WordDto {
  id: string;
  text: string;
}

export const stealVerbs = async (verbs: WordDto[]) => {
  const result: TensesData[] = [];

  // TODO: run in parallel
  for (let i = 0; i < verbs.length; i++) {
    const { id, text } = verbs[i];

    try {
      const data = await getVerbData(text);
      console.log(`${i + 1}/${verbs.length}: ${text}`);
      result.push({ wordId: id, data });
    } catch (e) {
      console.log('\n', 'error when loading: ', text);
    }
  }

  return result;
};
