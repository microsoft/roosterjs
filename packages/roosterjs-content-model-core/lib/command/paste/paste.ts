import { cleanHtmlComments } from './cleanHtmlComments';
import { cloneModelForPaste, mergePasteContent } from './mergePasteContent';
import { convertInlineCss } from '../createModelFromHtml/convertInlineCss';
import { createPasteFragment } from './createPasteFragment';
import { generatePasteOptionFromPlugins } from './generatePasteOptionFromPlugins';
import { retrieveHtmlInfo } from './retrieveHtmlInfo';
import type {
    PasteTypeOrGetter,
    ClipboardData,
    IEditor,
    DOMCreator,
} from 'roosterjs-content-model-types';

/**
 * Paste into editor using a clipboardData object
 * @param editor The Editor object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteTypeOrGetter Type of content to paste or function that returns the Paste Type to use based on the document and the clipboard Data. @default normal
 */
export function paste(
    editor: IEditor,
    clipboardData: ClipboardData,
    pasteTypeOrGetter: PasteTypeOrGetter = 'normal'
) {
    editor.focus();
    let isFirstPaste = false;

    if (!clipboardData.modelBeforePaste) {
        isFirstPaste = true;

        editor.formatContentModel(model => {
            clipboardData.modelBeforePaste = cloneModelForPaste(model);

            return false;
        });
    }

    // 1. Prepare variables
    const domCreator = editor.getDOMCreator();
    if (!domCreator.isBypassed && clipboardData.rawHtml) {
        clipboardData.rawHtml = cleanHtmlComments(clipboardData.rawHtml);
    }
    const doc = createDOMFromHtml(clipboardData.rawHtml, domCreator);
    const pasteType =
        typeof pasteTypeOrGetter == 'function'
            ? pasteTypeOrGetter(doc, clipboardData)
            : pasteTypeOrGetter;

    // 2. Handle HTML from clipboard
    const htmlFromClipboard = retrieveHtmlInfo(doc, clipboardData);

    // 3. Create target fragment
    const sourceFragment = createPasteFragment(
        editor.getDocument(),
        clipboardData,
        pasteType,
        (clipboardData.rawHtml == clipboardData.html
            ? doc
            : createDOMFromHtml(clipboardData.html, domCreator)
        )?.body
    );

    // 4. Trigger BeforePaste event to allow plugins modify the fragment
    const eventResult = generatePasteOptionFromPlugins(
        editor,
        clipboardData,
        sourceFragment,
        htmlFromClipboard,
        pasteType
    );

    // 5. Convert global CSS to inline CSS
    convertInlineCss(eventResult.fragment, htmlFromClipboard.globalCssRules);

    // 6. Merge pasted content into main Content Model
    mergePasteContent(editor, eventResult, isFirstPaste);
}

function createDOMFromHtml(
    html: string | null | undefined,
    domCreator: DOMCreator
): Document | null {
    return html ? domCreator.htmlToDOM(html) : null;
}
