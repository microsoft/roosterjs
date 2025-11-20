import { addParser } from '../utils/addParser';
import { adjustPercentileLineHeightParser } from './parsers/adjustPercentileLineHeightParser';
import { getStyleMetadata } from './getStyleMetadata';
import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import { setProcessor } from '../utils/setProcessor';
import { wordDesktopElementProcessor } from './processors/wordDesktopElementProcessor';
import { wordDesktopListLevelParser } from './parsers/wordDesktopListLevelParser';
import { wordDesktopTableParser } from './parsers/wordDesktopTableParser';
import type { DomToModelOption } from 'roosterjs-content-model-types';
import type { WordMetadata } from './WordMetadata';

/**
 * @internal
 * Handles Pasted content when source is Word Desktop
 * @param domToModelOptions Options for DOM to model conversion
 * @param htmlString The HTML string containing Word Desktop content with style metadata
 */
export function processPastedContentFromWordDesktop(
    domToModelOptions: DomToModelOption,
    htmlString: string
) {
    const metadataMap: Map<string, WordMetadata> = getStyleMetadata(htmlString);

    setProcessor(domToModelOptions, 'element', wordDesktopElementProcessor(metadataMap));
    addParser(domToModelOptions, 'block', adjustPercentileLineHeightParser);
    addParser(domToModelOptions, 'block', removeNegativeTextIndentParser);
    addParser(domToModelOptions, 'listLevel', wordDesktopListLevelParser);
    addParser(domToModelOptions, 'container', wordDesktopTableParser);
    addParser(domToModelOptions, 'table', wordDesktopTableParser);
}
