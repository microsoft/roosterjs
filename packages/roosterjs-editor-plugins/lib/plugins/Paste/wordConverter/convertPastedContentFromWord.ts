import commentsRemoval from './commentsRemoval';
import { BeforePasteEvent } from 'roosterjs-editor-types';
import { chainSanitizerCallback, moveChildNodes } from 'roosterjs-editor-dom';
import { createWordConverter } from './wordConverter';
import { createWordConverterArguments } from './WordConverterArguments';
import { processNodeConvert, processNodesDiscovery } from './converterUtils';

/**
 * @internal
 * Converts all the Word generated list items in the specified node into standard HTML UL and OL tags
 */
export default function convertPastedContentFromWord(event: BeforePasteEvent) {
    const { sanitizingOption, fragment } = event;

    // Preserve <o:p> when its innerHTML is "&nbsp;" to avoid dropping an empty line
    chainSanitizerCallback(sanitizingOption.elementCallbacks, 'O:P', element => {
        moveChildNodes(element);
        element.appendChild(element.ownerDocument.createTextNode('\u00A0')); // &nbsp;
        return true;
    });

    let wordConverter = createWordConverter();

    // First find all the nodes that we need to check for list item information
    // This call will return all the p and header elements under the root node.. These are the elements that
    // Word uses a list items, so we'll only process them and avoid walking the whole tree.
    let elements = fragment.querySelectorAll('p');
    if (elements.length > 0) {
        wordConverter.wordConverterArgs = createWordConverterArguments(elements);
        if (processNodesDiscovery(wordConverter)) {
            processNodeConvert(wordConverter);
        }
    }

    // If the List style contains marginBottom = 0in, the space after the list is going to be too narrow.
    // Remove this style so the list displays correctly.
    ['OL', 'UL'].forEach(tag => {
        chainSanitizerCallback(sanitizingOption.elementCallbacks, tag, element => {
            if (element.style.marginBottom == '0in') {
                element.style.marginBottom = '';
            }

            return true;
        });
    });
    commentsRemoval(sanitizingOption.elementCallbacks);
}
