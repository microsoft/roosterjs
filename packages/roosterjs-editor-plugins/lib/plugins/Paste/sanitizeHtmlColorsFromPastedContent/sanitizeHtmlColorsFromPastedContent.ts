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
    htmlElements.forEach(tag =>
        chainSanitizerCallback(sanitizingOption.elementCallbacks, getTagOfNode(tag), element => {
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
