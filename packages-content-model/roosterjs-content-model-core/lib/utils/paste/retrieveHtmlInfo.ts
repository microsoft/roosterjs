import { isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import type { ClipboardData } from 'roosterjs-content-model-types';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

/**
 * @internal
 */
export interface CssRule {
    selectors: string[];
    text: string;
}

/**
 * @internal
 */
export interface HtmlFromClipboard {
    metadata: Record<string, string>;
    globalCssRules: CssRule[];
    htmlBefore?: string;
    htmlAfter?: string;
}

/**
 * @internal
 */
export function retrieveHtmlInfo(
    doc: Document | null,
    clipboardData: Partial<ClipboardData>
): HtmlFromClipboard {
    let result: HtmlFromClipboard = {
        metadata: {},
        globalCssRules: [],
    };

    if (doc) {
        result = {
            ...retrieveHtmlStrings(clipboardData),
            globalCssRules: retrieveCssRules(doc),
            metadata: retrieveMetadata(doc),
        };

        clipboardData.htmlFirstLevelChildTags = retrieveTopLevelTags(doc);
    }

    return result;
}

function retrieveTopLevelTags(doc: Document): string[] {
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
    }

    return topLevelTags;
}

function retrieveMetadata(doc: Document): Record<string, string> {
    const result: Record<string, string> = {};
    const attributes = doc.querySelector('html')?.attributes;

    (attributes ? toArray(attributes) : []).forEach(attr => {
        result[attr.name] = attr.value;
    });

    toArray(doc.querySelectorAll('meta')).forEach(meta => {
        result[meta.name] = meta.content;
    });

    return result;
}

function retrieveCssRules(doc: Document): CssRule[] {
    const styles = toArray(doc.querySelectorAll('style'));
    const result: CssRule[] = [];

    styles.forEach(styleNode => {
        const sheet = styleNode.sheet as CSSStyleSheet;

        for (let ruleIndex = 0; ruleIndex < sheet.cssRules.length; ruleIndex++) {
            const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;

            if (rule.type == CSSRule.STYLE_RULE && rule.selectorText) {
                result.push({
                    selectors: rule.selectorText.split(','),
                    text: rule.style.cssText,
                });
            }
        }

        styleNode.parentNode?.removeChild(styleNode);
    });

    return result;
}

function retrieveHtmlStrings(
    clipboardData: Partial<ClipboardData>
): {
    htmlBefore: string;
    htmlAfter: string;
} {
    const rawHtml = clipboardData.rawHtml ?? '';
    const startIndex = rawHtml.indexOf(START_FRAGMENT);
    const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);
    let htmlBefore = '';
    let htmlAfter = '';

    if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        htmlBefore = rawHtml.substring(0, startIndex);
        htmlAfter = rawHtml.substring(endIndex + END_FRAGMENT.length);
        clipboardData.html = rawHtml.substring(startIndex + START_FRAGMENT.length, endIndex);
    } else {
        clipboardData.html = rawHtml;
    }

    return { htmlBefore, htmlAfter };
}
