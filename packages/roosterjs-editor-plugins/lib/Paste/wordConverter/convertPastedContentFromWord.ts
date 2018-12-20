import { createWordConverter } from './wordConverter';
import { createWordConverterArguments } from './WordConverterArguments';
import { HtmlSanitizer } from 'roosterjs-html-sanitizer';
import { processNodeConvert, processNodesDiscovery } from './converterUtils';

/** Converts all the Word generated list items in the specified node into standard HTML UL and OL tags */
export default function convertPastedContentFromWord(doc: HTMLDocument) {
    let sanitizer = new HtmlSanitizer({
        elementCallbacks: {
            ['O:P']: () => false,
        },
        additionalAllowAttributes: ['class'],
    });
    sanitizer.sanitize(doc.body);

    let wordConverter = createWordConverter();

    // First find all the nodes that we need to check for list item information
    // This call will return all the p and header elements under the root node.. These are the elements that
    // Word uses a list items, so we'll only process them and avoid walking the whole tree.
    let elements = doc.querySelectorAll('p');
    if (elements.length > 0) {
        wordConverter.wordConverterArgs = createWordConverterArguments(elements);
        if (processNodesDiscovery(wordConverter)) {
            processNodeConvert(wordConverter);
        }
    }
}
