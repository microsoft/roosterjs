import addParser from '../utils/addParser';
import ContentModelBeforePasteEvent from '../../../../publicTypes/event/ContentModelBeforePasteEvent';
import { chainSanitizerCallback, getStyles } from 'roosterjs-editor-dom';
import { moveAndReplaceChildNodes } from 'roosterjs-content-model-dom';
import { processWordComments } from './processWordComments';
import { processWordList } from './processWordLists';
import { setProcessor } from '../utils/setProcessor';
import {
    ContentModelBlockFormat,
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
    DomToModelContext,
    ElementProcessor,
    FormatParser,
} from 'roosterjs-content-model-types';

const PERCENTAGE_REGEX = /%/;
const DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE = 120;

/**
 * @internal
 * Handles Pasted content when source is Word Desktop
 * @param ev ContentModelBeforePasteEvent
 */
export function processPastedContentFromWordDesktop(ev: ContentModelBeforePasteEvent) {
    setProcessor(ev.domToModelOption, 'element', wordDesktopElementProcessor);
    addParser(ev.domToModelOption, 'block', removeNonValidLineHeight);
    addParser(ev.domToModelOption, 'listLevel', listLevelParser);
    addParser(ev.domToModelOption, 'listItemElement', listItemElementParser);

    // Remove "border:none" for image to fix image resize behavior
    // We found a problem that when paste an image with "border:none" then the resize border will be
    // displayed incorrectly when resize it. So we need to drop this style
    chainSanitizerCallback(
        ev.sanitizingOption.cssStyleCallbacks,
        'border',
        (value, element) => element.tagName != 'IMG' || value != 'none'
    );

    // Preserve <o:p> when its innerHTML is "&nbsp;" to avoid dropping an empty line
    chainSanitizerCallback(ev.sanitizingOption.elementCallbacks, 'O:P', element => {
        moveAndReplaceChildNodes(element);
        element.appendChild(element.ownerDocument.createTextNode('\u00A0')); // &nbsp;
        return true;
    });
}

/**
 * @internal
 * Exported only for unit test
 */
export const wordDesktopElementProcessor: ElementProcessor<HTMLElement> = (
    group,
    element,
    context
) => {
    const styles = getStyles(element);
    // Process Word Lists or Word Commands, otherwise use the default processor on this element.
    if (
        !(processWordList(styles, group, element, context) || processWordComments(styles, element))
    ) {
        context.defaultElementProcessors.element(group, element, context);
    }
};

function removeNonValidLineHeight(
    format: ContentModelBlockFormat,
    element: HTMLElement,
    context: DomToModelContext,
    defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
): void {
    //If the line height is less than the browser default line height, line between the text is going to be too narrow
    let parsedLineHeight: number;
    if (
        PERCENTAGE_REGEX.test(element.style.lineHeight) &&
        !isNaN((parsedLineHeight = parseInt(element.style.lineHeight))) &&
        parsedLineHeight < DEFAULT_BROWSER_LINE_HEIGHT_PERCENTAGE
    ) {
        format.lineHeight = defaultStyle.lineHeight;
    }
}

function listLevelParser(
    format: ContentModelListItemLevelFormat,
    element: HTMLElement,
    context: DomToModelContext,
    defaultStyle: Readonly<Partial<CSSStyleDeclaration>>
): void {
    if (element.style.marginLeft != '') {
        format.marginLeft = defaultStyle.marginLeft;
    }

    format.marginBottom = undefined;
}

const listItemElementParser: FormatParser<ContentModelListItemFormat> = (
    format: ContentModelListItemFormat,
    element: HTMLElement
): void => {
    if (element.style.marginLeft) {
        format.marginLeft = undefined;
    }
    if (element.style.marginRight) {
        format.marginRight = undefined;
    }
};
