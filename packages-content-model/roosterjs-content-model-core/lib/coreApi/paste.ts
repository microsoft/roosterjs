import { cloneModel } from '../publicApi/model/cloneModel';
import { convertInlineCss } from '../utils/convertInlineCss';
import { createPasteFragment } from '../utils/paste/createPasteFragment';
import { generatePasteOptionFromPlugins } from '../utils/paste/generatePasteOptionFromPlugins';
import { mergePasteContent } from '../utils/paste/mergePasteContent';
import { retrieveHtmlInfo } from '../utils/paste/retrieveHtmlInfo';
import type { CloneModelOptions } from '../publicApi/model/cloneModel';
import type {
    PasteType,
    ClipboardData,
    Paste,
    EditorCore,
    TrustedHTMLHandler,
} from 'roosterjs-content-model-types';

const CloneOption: CloneModelOptions = {
    includeCachedElement: (node, type) => (type == 'cache' ? undefined : node),
};

/**
 * @internal
 * Paste into editor using a clipboardData object
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteType Type of content to paste. @default normal
 */
export const paste: Paste = (
    core: EditorCore,
    clipboardData: ClipboardData,
    pasteType: PasteType = 'normal'
) => {
    core.api.focus(core);

    if (clipboardData.modelBeforePaste) {
        core.api.setContentModel(core, cloneModel(clipboardData.modelBeforePaste, CloneOption));
    } else {
        clipboardData.modelBeforePaste = cloneModel(core.api.createContentModel(core), CloneOption);
    }

    // 1. Prepare variables
    const doc = createDOMFromHtml(clipboardData.rawHtml, core.trustedHTMLHandler);

    // 2. Handle HTML from clipboard
    const htmlFromClipboard = retrieveHtmlInfo(doc, clipboardData);

    // 3. Create target fragment
    const sourceFragment = createPasteFragment(
        core.physicalRoot.ownerDocument,
        clipboardData,
        pasteType,
        (clipboardData.rawHtml == clipboardData.html
            ? doc
            : createDOMFromHtml(clipboardData.html, core.trustedHTMLHandler)
        )?.body
    );

    // 4. Trigger BeforePaste event to allow plugins modify the fragment
    const eventResult = generatePasteOptionFromPlugins(
        core,
        clipboardData,
        sourceFragment,
        htmlFromClipboard,
        pasteType
    );

    // 5. Convert global CSS to inline CSS
    convertInlineCss(eventResult.fragment, htmlFromClipboard.globalCssRules);

    // 6. Merge pasted content into main Content Model
    mergePasteContent(core, eventResult, clipboardData);
};

function createDOMFromHtml(
    html: string | null | undefined,
    trustedHTMLHandler: TrustedHTMLHandler
): Document | null {
    return html ? new DOMParser().parseFromString(trustedHTMLHandler(html), 'text/html') : null;
}
