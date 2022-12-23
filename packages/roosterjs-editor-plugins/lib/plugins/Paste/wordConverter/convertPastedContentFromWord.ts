import commentsRemoval from './commentsRemoval';
import { BeforePasteEvent } from 'roosterjs-editor-types';
import { chainSanitizerCallback, moveChildNodes } from 'roosterjs-editor-dom';
import { createWordConverter } from './wordConverter';
import { createWordConverterArguments } from './WordConverterArguments';
import { processNodeConvert, processNodesDiscovery } from './converterUtils';

const PERCENTAGE_REGEX = /%/;
const DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE = 120;
const LIST_ELEMENTS_SELECTOR = 'p,h1,h2,h3,h4,h5,h6';

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
    let elements = fragment.querySelectorAll(LIST_ELEMENTS_SELECTOR) as NodeListOf<HTMLElement>;
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

    //If the line height is less than the browser default line height, line between the text is going to be too narrow
    chainSanitizerCallback(sanitizingOption.cssStyleCallbacks, 'line-height', (value: string) => {
        let parsedLineHeight: number;
        if (
            PERCENTAGE_REGEX.test(value) &&
            !isNaN((parsedLineHeight = parseInt(value))) &&
            parsedLineHeight < DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE
        ) {
            return false;
        }
        return true;
    });

    commentsRemoval(sanitizingOption.elementCallbacks, sanitizingOption.cssStyleCallbacks);
}
