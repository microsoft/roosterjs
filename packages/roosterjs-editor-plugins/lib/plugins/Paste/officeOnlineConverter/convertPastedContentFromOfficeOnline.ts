import { WAC_IDENTIFY_SELECTOR } from '../sourceValidations/constants';
import convertPastedContentFromWordOnline, {
    isWordOnlineWithList,
} from './convertPastedContentFromWordOnline';

/**
 * @internal
 * Convert pasted content from Office Online
 * Once it is known that the document is from WAC
 * We need to remove the display property and margin from all the list item
 * @param event The BeforePaste event
 */
export default function convertPastedContentFromOfficeOnline(fragment: DocumentFragment) {
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
}
