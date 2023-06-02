import getTagOfNode from '../utils/getTagOfNode';
import toArray from '../jsUtils/toArray';
import { BeforePasteEvent, TrustedHTMLHandler } from 'roosterjs-editor-types';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

/**
 * Retrieves the metadata from the content inside of the clipboard
 * @param doc Document parsed from the clipboard
 * @param event Before Paste event
 * @param trustedHTMLHandler the trusted html handler to sanitize the content.
 */
export default function retrieveMetadataFromClipboard(
    doc: Document | undefined,
    event: BeforePasteEvent,
    trustedHTMLHandler: TrustedHTMLHandler
) {
    const { clipboardData, sanitizingOption } = event;
    const { rawHtml } = clipboardData;
    if (rawHtml && doc?.body) {
        const attributes = doc.querySelector('html')?.attributes;
        (attributes ? toArray(attributes) : []).reduce((attrs, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
        }, event.htmlAttributes);
        toArray(doc.querySelectorAll('meta')).reduce((attrs, meta) => {
            attrs[meta.name] = meta.content;
            return attrs;
        }, event.htmlAttributes);

        clipboardData.htmlFirstLevelChildTags = [];
        doc?.body.normalize();

        for (let i = 0; i < doc?.body.childNodes.length; i++) {
            const node = doc?.body.childNodes.item(i);
            if (node.nodeType == Node.TEXT_NODE) {
                const trimmedString = node.nodeValue?.replace(/(\r\n|\r|\n)/gm, '').trim();
                if (!trimmedString) {
                    continue;
                }
            }
            const nodeTag = getTagOfNode(node);
            if (node.nodeType != Node.COMMENT_NODE) {
                clipboardData.htmlFirstLevelChildTags.push(nodeTag);
            }
        }
        // Move all STYLE nodes into header, and save them into sanitizing options.
        // Because if we directly move them into a fragment, all sheets under STYLE will be lost.
        processStyles(doc, style => {
            doc?.head.appendChild(style);
            sanitizingOption.additionalGlobalStyleNodes.push(style);
        });

        const startIndex = rawHtml.indexOf(START_FRAGMENT);
        const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

        if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
            event.htmlBefore = rawHtml.substr(0, startIndex);
            event.htmlAfter = rawHtml.substr(endIndex + END_FRAGMENT.length);
            clipboardData.html = rawHtml.substring(startIndex + START_FRAGMENT.length, endIndex);
            doc.body.innerHTML = trustedHTMLHandler(clipboardData.html);

            // Remove style nodes just added by setting innerHTML of body since we already have all
            // style nodes in header.
            // Here we use doc.body instead of doc because we only want to remove STYLE nodes under BODY
            // and the nodes under HEAD are still used when convert global CSS to inline
            processStyles(doc.body, style => style.parentNode?.removeChild(style));
        }
    }
}

function processStyles(node: ParentNode, callback: (style: HTMLStyleElement) => void) {
    toArray(node.querySelectorAll('style')).forEach(callback);
}
