import { chainSanitizerCallback, getTagOfNode } from 'roosterjs-editor-dom';
import { DeprecatedColorList } from './deprecatedColorList';
import { HtmlSanitizerOptions } from 'roosterjs-editor-types';

/**
 * @internal
 * Remove the deprecated colors from pasted content
 * @param fragment the pasted fragment
 * @param sanitizingOption the sanitizingOption of BeforePasteEvent
 * */
export default function sanitizeHtmlColorsFromPastedContent(
    fragment: DocumentFragment,
    sanitizingOption: Required<HtmlSanitizerOptions>
) {
    const htmlElements = fragment.querySelectorAll('*') as NodeListOf<HTMLElement>;
    const allTags = Array.from(htmlElements).map(el => getTagOfNode(el));
    const uniqueTags = allTags.filter((tag, index) => allTags.indexOf(tag) == index);

    uniqueTags.forEach(tag =>
        chainSanitizerCallback(sanitizingOption.elementCallbacks, tag, element => {
            if (DeprecatedColorList.indexOf(element.style.color) > -1) {
                element.style.removeProperty('color');
            }

            if (DeprecatedColorList.indexOf(element.style.backgroundColor) > -1) {
                element.style.removeProperty('background-color');
            }
            return true;
        })
    );
}
