import { ChangeSource } from '../../constants/ChangeSource';
import { convertInlineCss } from '../../utils/paste/convertInlineCss';
import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import { createPasteFragment } from '../../utils/paste/createPasteFragment';
import { createPasteGeneralProcessor } from '../../override/pasteGeneralProcessor';
import { generatePendingFormat } from '../../utils/paste/generatePendingFormat';
import { getSelectedSegments } from '../selection/collectSelections';
import { handleLastPaste } from '../../utils/paste/handleLastPaste';
import { mergePasteContent } from '../../utils/paste/mergePasteContent';
import { pasteEntityProcessor } from '../../override/pasteEntityProcessor';
import { retrieveFirstLevelTags } from '../../utils/paste/retrieveFirstLevelTags';
import { retrieveGlobalCss } from '../../utils/paste/retrieveGlobalCSS';
import { retrieveHtml } from '../../utils/paste/retrieveHtml';
import { retrievePasteMetadata } from '../../utils/paste/retrievePasteMetadata';
import { triggerBeforePasteEvent } from '../../utils/paste/triggerBeforePasteEvent';
import type { HtmlFromClipboard } from '../../utils/paste/retrieveHtml';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    PasteType,
    IStandaloneEditor,
    ClipboardData,
} from 'roosterjs-content-model-types';
import type { IEditor, TrustedHTMLHandler } from 'roosterjs-editor-types';

/**
 * Paste into editor using a clipboardData object
 * @param editor The editor to paste content into
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteType Type of content to paste. @default normal
 * @param [defaultDomToModelOptions=[]] Default options for DOM to Content model conversion
 */
export function paste(
    editor: IStandaloneEditor & IEditor,
    clipboardData: ClipboardData,
    pasteType: PasteType = 'normal'
) {
    editor.focus();
    editor.formatContentModel(
        (model, context) => {
            handleLastPaste(clipboardData, model);

            // 1. Prepare variables
            const trustHtmlHandler = editor.getTrustedHTMLHandler();
            const doc = createDOMFromHtml(clipboardData.rawHtml, trustHtmlHandler);
            const htmlAttributes: Record<string, string> = {};
            const cssRules: CSSStyleRule[] = [];
            const outboundHtml: HtmlFromClipboard = {};
            const currentFormat = getCurrentSegmentFormat(model);

            // 2. Handle HTML from clipboard
            if (doc) {
                doc.body.normalize();

                retrievePasteMetadata(doc, htmlAttributes);
                retrieveGlobalCss(doc, cssRules);
                retrieveHtml(clipboardData, outboundHtml);

                clipboardData.html = outboundHtml.html;
                clipboardData.htmlFirstLevelChildTags = retrieveFirstLevelTags(doc);
            }

            // 3. Create target fragment
            const body =
                (clipboardData.rawHtml == clipboardData.html
                    ? doc
                    : createDOMFromHtml(clipboardData.html, trustHtmlHandler)
                )?.body ?? null;
            const sourceFragment = createPasteFragment(
                editor.getDocument(),
                clipboardData,
                currentFormat,
                pasteType,
                body
            );

            // 4. Trigger BeforePaste event to allow plugins modify the fragment
            const { domToModelOption, customizedMerge, fragment } = triggerBeforePasteEvent(
                editor,
                clipboardData,
                sourceFragment,
                outboundHtml,
                htmlAttributes,
                pasteType
            );

            // 5. Convert global CSS to inline CSS
            convertInlineCss(fragment, cssRules);

            // 6. Merge pasted content into main Content Model
            const copiedModel = domToContentModel(
                fragment,
                createDomToModelContext(
                    undefined /*editorContext*/,
                    ...editor.getDOMToModelOptions(),
                    {
                        processorOverride: {
                            entity: pasteEntityProcessor,
                            '*': createPasteGeneralProcessor(domToModelOption),
                        },
                    },
                    domToModelOption
                )
            );
            mergePasteContent(
                model,
                context,
                copiedModel,
                pasteType == 'mergeFormat',
                customizedMerge
            );

            // 6. Resume original segment as pending format
            context.newPendingFormat = generatePendingFormat(model.format, currentFormat);

            return true;
        },
        {
            changeSource: ChangeSource.Paste,
            getChangeData: () => clipboardData,
            apiName: 'paste',
        }
    );
}

function getCurrentSegmentFormat(model: ContentModelDocument): ContentModelSegmentFormat {
    const currentSegment = getSelectedSegments(model, true /*includingFormatHolder*/)[0];
    const { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight } =
        currentSegment?.format ?? {};
    return {
        fontFamily,
        fontSize,
        textColor,
        backgroundColor,
        letterSpacing,
        lineHeight,
    };
}

function createDOMFromHtml(
    html: string | null | undefined,
    trustedHTMLHandler: TrustedHTMLHandler
): Document | null {
    return html ? new DOMParser().parseFromString(trustedHTMLHandler(html), 'text/html') : null;
}
