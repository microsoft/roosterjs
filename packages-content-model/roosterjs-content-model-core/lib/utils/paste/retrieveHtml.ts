import { isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import type { ClipboardData } from 'roosterjs-content-model-types';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

/**
 * @internal
 */
export interface HtmlFromClipboard {
    metadata: Record<string, string>;
    globalCssRules: CSSStyleRule[];
    htmlBefore?: string;
    htmlAfter?: string;
}

/**
 * @internal
 */
export function retrieveHtml(
    doc: Document | null,
    clipboardData: ClipboardData
): HtmlFromClipboard {
    const html: HtmlFromClipboard = { metadata: {}, globalCssRules: [] };

    if (doc) {
        // Retrieve HTML before and after fragment if any
        const rawHtml = clipboardData.rawHtml ?? '';
        const startIndex = rawHtml.indexOf(START_FRAGMENT);
        const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

        if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
            html.htmlBefore = rawHtml.substring(0, startIndex);
            html.htmlAfter = rawHtml.substring(endIndex + END_FRAGMENT.length);
            clipboardData.html = rawHtml.substring(startIndex + START_FRAGMENT.length, endIndex);
        } else {
            clipboardData.html = rawHtml;
        }

        // Retrieve HTML metadata
        const attributes = doc.querySelector('html')?.attributes;

        (attributes ? toArray(attributes) : []).forEach(attr => {
            html.metadata[attr.name] = attr.value;
        });

        toArray(doc.querySelectorAll('meta')).forEach(meta => {
            html.metadata[meta.name] = meta.content;
        });

        // Retrieve global CSS rules
        const styles = toArray(doc.querySelectorAll('style'));

        styles.forEach(styleNode => {
            const sheet = styleNode.sheet as CSSStyleSheet;

            for (let ruleIndex = 0; ruleIndex < sheet.cssRules.length; ruleIndex++) {
                const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;

                if (rule.type == CSSRule.STYLE_RULE && rule.selectorText) {
                    html.globalCssRules.push(rule);
                }
            }
        });

        // Retrieve top level element tags
        const topLevelTags: string[] = [];

        for (let child = doc.body.firstChild; child; child = child.nextSibling) {
            if (isNodeOfType(child, 'TEXT_NODE')) {
                const trimmedString = child.nodeValue?.replace(/(\r\n|\r|\n)/gm, '').trim();

                if (trimmedString) {
                    topLevelTags.push(''); // Push an empty string as tag for text node
                }
            } else if (isNodeOfType(child, 'ELEMENT_NODE')) {
                topLevelTags.push(child.tagName);
            }

            clipboardData.htmlFirstLevelChildTags = topLevelTags;
        }
    }

    return html;
}
