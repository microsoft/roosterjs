import { chainSanitizerCallback } from 'roosterjs-editor-dom';
import { HtmlSanitizerOptions } from 'roosterjs-editor-types';
import convertPastedContentFromWordOnline, {
    isWordOnlineWithList,
} from './convertPastedContentFromWordOnline';

const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer';
const TABLE_TEMP_ELEMENTS_QUERY = [
    'TableInsertRowGapBlank',
    'TableColumnResizeHandle',
    'TableCellTopBorderHandle',
    'TableCellLeftBorderHandle',
    'TableHoverColumnHandle',
    'TableHoverRowHandle',
]
    .map(className => `.${className}`)
    .join(',');
/**
 * @internal
 * Convert pasted content from Office Online
 * Once it is known that the document is from WAC
 * We need to remove the display property and margin from all the list item
 * @param event The BeforePaste event
 */
export default function convertPastedContentFromOfficeOnline(
    fragment: DocumentFragment,
    sanitizingOption: Required<HtmlSanitizerOptions>
) {
    fragment.querySelectorAll(WAC_IDENTIFY_SELECTOR).forEach((el: Element) => {
        const element = el as HTMLElement;
        element.style.removeProperty('display');
        element.style.removeProperty('margin');
    });
    // call conversion function if the pasted content is from word online and
    // has list element in the pasted content.
    if (isWordOnlineWithList(fragment)) {
        convertPastedContentFromWordOnline(fragment);
    }

    // Remove "border:none" for image to fix image resize behavior
    // We found a problem that when paste an image with "border:none" then the resize border will be
    // displayed incorrectly when resize it. So we need to drop this style
    chainSanitizerCallback(
        sanitizingOption.cssStyleCallbacks,
        'border',
        (value, element) => element.tagName != 'IMG' || value != 'none'
    );

    fragment
        .querySelectorAll(TABLE_TEMP_ELEMENTS_QUERY)
        .forEach(node => node.parentElement?.removeChild(node));
}
