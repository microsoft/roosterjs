import { ChangeSource } from '../../constants/ChangeSource';
import { cloneModel, CloneModelOptions } from './cloneModel';
import { convertInlineCss } from '../../utils/paste/convertInlineCss';
import { createPasteFragment } from '../../utils/paste/createPasteFragment';
import { generatePendingFormat } from '../../utils/paste/generatePendingFormat';
import { getSegmentTextFormat } from '../domUtils/getSegmentTextFormat';
import { getSelectedSegments } from '../selection/collectSelections';
import { mergePasteContent } from '../../utils/paste/mergePasteContent';
import { retrieveFirstLevelTags } from '../../utils/paste/retrieveFirstLevelTags';
import { retrieveGlobalCss } from '../../utils/paste/retrieveGlobalCSS';
import { retrieveHtml } from '../../utils/paste/retrieveHtml';
import { retrievePasteMetadata } from '../../utils/paste/retrievePasteMetadata';
import { triggerBeforePasteEvent } from '../../utils/paste/triggerBeforePasteEvent';
import type { HtmlFromClipboard } from '../../utils/paste/retrieveHtml';
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
            const htmlAttributes: Record<string, string> = {};
            const cssRules: CSSStyleRule[] = [];
            const htmlFromClipboard: HtmlFromClipboard = {};
            const selectedSegment = getSelectedSegments(model, true /*includeFormatHodler*/)[0];
            const currentFormat = selectedSegment ? getSegmentTextFormat(selectedSegment) : {};

            // 2. Handle HTML from clipboard
            if (doc) {
                doc.body.normalize();

                retrievePasteMetadata(doc, htmlAttributes);
                retrieveGlobalCss(doc, cssRules);
                retrieveHtml(clipboardData, htmlFromClipboard);

                clipboardData.html = htmlFromClipboard.html;
                clipboardData.htmlFirstLevelChildTags = retrieveFirstLevelTags(doc);
            }

            // 3. Create target fragment
            const sourceFragment = createPasteFragment(
                editor.getDocument(),
                clipboardData,
                currentFormat,
                pasteType,
                (clipboardData.rawHtml == clipboardData.html
                    ? doc
                    : createDOMFromHtml(clipboardData.html, trustHtmlHandler)
                )?.body
            );

            // 4. Trigger BeforePaste event to allow plugins modify the fragment
            // const { domToModelOption, customizedMerge, fragment } =
            const eventResult = triggerBeforePasteEvent(
                editor,
                clipboardData,
                sourceFragment,
                htmlFromClipboard,
                htmlAttributes,
                pasteType
            );

            // 5. Convert global CSS to inline CSS
            convertInlineCss(eventResult.fragment, cssRules);

            // 6. Merge pasted content into main Content Model
            const insertPoint = mergePasteContent(
                model,
                context,
                eventResult,
                defaultDomToModelOptions
            );

            // 7. Resume original segment as pending format
            context.newPendingFormat = generatePendingFormat(
                model.format,
                insertPoint?.marker.format
            );

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
