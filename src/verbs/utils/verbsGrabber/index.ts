import { JSDOM } from 'jsdom';
import { verbsConfigByTitles } from './verbsConfig';
import { VerbDataModel } from '../../verb-data.model';

export const stealVerb = async (verb: string) => {
  const url = encodeURI(
    `https://glagol.reverso.net/спряжение-испанский-глагол-${verb}.html`,
  ).trim();

  const result: VerbDataModel = {};

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
