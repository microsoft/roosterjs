import { ChangeSource } from '../../constants/ChangeSource';
import { cloneModel } from './cloneModel';
import { convertInlineCss } from '../../utils/paste/convertInlineCss';
import { createPasteFragment } from '../../utils/paste/createPasteFragment';
import { generatePasteOptionFromPlugins } from '../../utils/paste/generatePasteOptionFromPlugins';
import { mergePasteContent } from '../../utils/paste/mergePasteContent';
import { retrieveHtmlInfo } from '../../utils/paste/retrieveHtmlInfo';
import type { CloneModelOptions } from './cloneModel';
import type {
    PasteType,
    IStandaloneEditor,
    ClipboardData,
    DomToModelOption,
} from 'roosterjs-content-model-types';
import type { IEditor, TrustedHTMLHandler } from 'roosterjs-editor-types';

const CloneOption: CloneModelOptions = {
    includeCachedElement: (node, type) => (type == 'cache' ? undefined : node),
};

/**
 * Paste into editor using a clipboardData object
 * @param editor The editor to paste content into
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteType Type of content to paste. @default normal
 * @param defaultDomToModelOptions Default options for DOM to Content model conversion
 */
export function paste(
    editor: IStandaloneEditor & IEditor,
    clipboardData: ClipboardData,
    pasteType: PasteType = 'normal',
    defaultDomToModelOptions?: DomToModelOption
) {
    editor.focus();

    if (clipboardData.modelBeforePaste) {
        editor.setContentModel(cloneModel(clipboardData.modelBeforePaste, CloneOption));
    } else {
        clipboardData.modelBeforePaste = cloneModel(editor.createContentModel(), CloneOption);
    }

    editor.formatContentModel(
        (model, context) => {
            // 1. Prepare variables
            const trustHtmlHandler = editor.getTrustedHTMLHandler();
            const doc = createDOMFromHtml(clipboardData.rawHtml, trustHtmlHandler);

            // 2. Handle HTML from clipboard
            const htmlFromClipboard = retrieveHtmlInfo(doc, clipboardData);

            // 3. Create target fragment
            const sourceFragment = createPasteFragment(
                editor.getDocument(),
                clipboardData,
                pasteType,
                (clipboardData.rawHtml == clipboardData.html
                    ? doc
                    : createDOMFromHtml(clipboardData.html, trustHtmlHandler)
                )?.body
            );

            // 4. Trigger BeforePaste event to allow plugins modify the fragment
            // const { domToModelOption, customizedMerge, fragment } =
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
            mergePasteContent(model, context, eventResult, defaultDomToModelOptions);

            return true;
        },
        {
            changeSource: ChangeSource.Paste,
            getChangeData: () => clipboardData,
            apiName: 'paste',
        }
    );
}

function createDOMFromHtml(
    html: string | null | undefined,
    trustedHTMLHandler: TrustedHTMLHandler
): Document | null {
    return html ? new DOMParser().parseFromString(trustedHTMLHandler(html), 'text/html') : null;
}
