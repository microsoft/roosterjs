import { convertInlineCss } from '../../utils/convertInlineCss';
import { createPasteFragment } from '../../utils/paste/createPasteFragment';
import { generatePasteOptionFromPlugins } from '../../utils/paste/generatePasteOptionFromPlugins';
import { mergePasteContent } from '../../utils/paste/mergePasteContent';
import { retrieveHtmlInfo } from '../../utils/paste/retrieveHtmlInfo';
import type {
    PasteType,
    ClipboardData,
    TrustedHTMLHandler,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * Paste into editor using a clipboardData object
 * @param editor The Editor object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteType Type of content to paste. @default normal
 */
export function paste(
    editor: IEditor,
    clipboardData: ClipboardData,
    pasteType: PasteType = 'normal'
) {
    editor.focus();

    const trustedHTMLHandler = editor.getTrustedHTMLHandler();

    if (!clipboardData.modelBeforePaste) {
        clipboardData.modelBeforePaste = editor.getContentModelCopy('connected');
    }

    // 1. Prepare variables
    const doc = createDOMFromHtml(clipboardData.rawHtml, trustedHTMLHandler);

    // 2. Handle HTML from clipboard
    const htmlFromClipboard = retrieveHtmlInfo(doc, clipboardData);

    // 3. Create target fragment
    const sourceFragment = createPasteFragment(
        editor.getDocument(),
        clipboardData,
        pasteType,
        (clipboardData.rawHtml == clipboardData.html
            ? doc
            : createDOMFromHtml(clipboardData.html, trustedHTMLHandler)
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
    mergePasteContent(editor, eventResult, clipboardData);
}

function createDOMFromHtml(
    html: string | null | undefined,
    trustedHTMLHandler: TrustedHTMLHandler
): Document | null {
    return html ? new DOMParser().parseFromString(trustedHTMLHandler(html), 'text/html') : null;
}
