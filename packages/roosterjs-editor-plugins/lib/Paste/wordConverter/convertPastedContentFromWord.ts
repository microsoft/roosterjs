import { createWordConverter } from './wordConverter';
import { createWordConverterArguments } from './WordConverterArguments';
import { processNodesDiscovery, processNodeConvert } from './converterUtils';

/** Converts all the Word generated list items in the specified node into standard HTML UL and OL tags */
export default function convertPastedContentFromWord(root: NodeSelector) {
    let wordConverter = createWordConverter();

    // First find all the nodes that we need to check for list item information
    // This call will return all the p and header elements under the root node.. These are the elements that
    // Word uses a list items, so we'll only process them and avoid walking the whole tree.
    let elements = root.querySelectorAll('p');
    if (elements.length > 0) {
        wordConverter.wordConverterArgs = createWordConverterArguments(elements);
        if (processNodesDiscovery(wordConverter)) {
            processNodeConvert(wordConverter);
        }
    }
}
