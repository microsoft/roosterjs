const STYLE_TAG_FILTER = 'style';
const STYLEORLINK_REGEX = /<style|<link/i;

// Matches global style and body tag
const STYLE_REGEX = /<style[^>]*>([\s\S]*?)<\/style>/gi;

// Group regex. It should return two matches:
// match 1: the full match (including the body tag)
// match 2: everything inside body
const BODY_REGEX = /<body[^>]*>([\s\S]*)<\/body>/i;

// Pseudo selector, for things like :hover :link
// TODO: Outlook desktop emails used to contain some global P style
const PSEUDOSELECTOR_REGEX = /\w+\s*:\w+\s*/i;

function forEachElementInQueryResult(
    doc: Document,
    selector: string,
    callback: (ele: HTMLElement) => void
) {
    let elements = doc.querySelectorAll(selector);

    for (let i = elements.length - 1; i >= 0; i--) {
        callback(elements[i] as HTMLElement);
    }
}

/**
 * This is a fallback when we failed to convert through iframe
 * It will be a version with global style wiped out
 */
function convertThroughRegEx(sourceHtml: string): string {
    let sourceWithoutStyle = sourceHtml.replace(STYLE_REGEX, '');
    let bodyMatches = BODY_REGEX.exec(sourceWithoutStyle);
    return bodyMatches != null && bodyMatches.length > 1
        ? bodyMatches[1].trim()
        : sourceWithoutStyle;
}

/**
 * Convert CSS from header or external, to inline CSS
 */
export default function convertInlineCss(
    sourceHtml: string,
    additionalStyleNodes?: HTMLStyleElement[]
): string {
    // Skip for empty string
    if (!sourceHtml) {
        return '';
    }

    // If there's no stylesheet, just return
    if (!STYLEORLINK_REGEX.test(sourceHtml) && !additionalStyleNodes) {
        return convertThroughRegEx(sourceHtml);
    }

    let result: string;

    try {
        let domParser = new DOMParser();
        let contentDocument = domParser.parseFromString(sourceHtml, 'text/html');
        let styleSheets: CSSStyleSheet[] = [];
        for (let i = additionalStyleNodes ? additionalStyleNodes.length - 1 : -1; i >= 0; i--) {
            styleSheets.push(additionalStyleNodes[i].sheet as CSSStyleSheet);
        }

        forEachElementInQueryResult(contentDocument, 'style', style => {
            styleSheets.push((<HTMLStyleElement>style).sheet as CSSStyleSheet);
        })

        for (let styleSheet of styleSheets) {
            for (let j = styleSheet.cssRules.length - 1; j >= 0; j--) {
                // Skip any none-style rule, i.e. @page
                let styleRule = styleSheet.cssRules[j] as CSSStyleRule;
                if (styleRule.type != CSSRule.STYLE_RULE || !styleRule.style.cssText) {
                    continue;
                }
                // Make sure the selector is not empty
                let selectors = styleRule.selectorText ? styleRule.selectorText.split(',') : null;
                for (let selector of (selectors || [])) {
                    if (!selector || !selector.trim() || selector.match(PSEUDOSELECTOR_REGEX)) {
                        continue;
                    }
                    forEachElementInQueryResult(contentDocument, selector, element => {
                        // Always put existing styles after so that they have higher priority
                        // Which means if both global style and inline style apply to the same element,
                        // inline style will have higher priority
                        element.setAttribute(
                            'style',
                            styleRule.style.cssText + (element.getAttribute('style') || '')
                        );
                    });
                }
            }
        }

        // Remove <style> tags in body if any
        forEachElementInQueryResult(contentDocument, STYLE_TAG_FILTER, (element: HTMLElement) => {
            element.parentNode.removeChild(element);
        });

        result = contentDocument.body.innerHTML.trim();
    } catch (e) {}

    return result || convertThroughRegEx(sourceHtml);
}
