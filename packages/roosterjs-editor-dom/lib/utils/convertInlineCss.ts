const DOCTYPE_HTML5 = '<!doctype html>';
const STYLE_TAG_FILTER = 'style';
const STYLEORLINK_REGEX = /<style|<link/i;
const DOCTYPE_REGEX = /^\s*<!doctype /i;

// Matches global style and body tag
const STYLE_REGEX = /<style[^>]*>([\s\S]*?)<\/style>/gi;

// Group regex. It should return two matches:
// match 1: the full match (including the body tag)
// match 2: everything inside body
const BODY_REGEX = /<body[^>]*>([\s\S]*)<\/body>/i;

// Pseudo selector, for things like :hover :link
// TODO: Outlook desktop emails used to contain some global P style
const PSEUDOSELECTOR_REGEX = /\w+\s*:\w+\s*/i;

let contentIFrameForInlineCssConverter: HTMLIFrameElement;

function runWithTempIFrame(callback: (doc: Document) => void): boolean {
    if (!contentIFrameForInlineCssConverter) {
        contentIFrameForInlineCssConverter = document.createElement('IFRAME') as HTMLIFrameElement;
        contentIFrameForInlineCssConverter.style.display = 'none';
    }

    document.body.appendChild(contentIFrameForInlineCssConverter);
    let contentDocument =
        contentIFrameForInlineCssConverter.contentDocument ||
        contentIFrameForInlineCssConverter.contentWindow.document;

    try {
        callback(contentDocument);
        return true;
    } catch (exception) {
        // just swallow all exception for the moment
        return false;
    } finally {
        contentDocument.body.innerHTML = '';
        contentDocument.head.innerHTML = '';
        document.body.removeChild(contentIFrameForInlineCssConverter);
    }
}

function forEachElementInQueryResult(
    doc: Document,
    selector: string,
    callback: (ele: HTMLElement) => void
) {
    let elements = doc.querySelectorAll(selector);

    for (let i = 0; i < elements.length; i++) {
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
export default function convertInlineCss(sourceHtml: string, additionalStyleNodes?: HTMLStyleElement[]): string {
    // Skip for empty string
    if (!sourceHtml) {
        return '';
    }

    // If there's no stylesheet, just return
    if (!STYLEORLINK_REGEX.test(sourceHtml) && !additionalStyleNodes) {
        return convertThroughRegEx(sourceHtml);
    }
    // Always add <!doctype html> if source html doesn't have doctype
    if (!DOCTYPE_REGEX.test(sourceHtml)) {
        sourceHtml = DOCTYPE_HTML5 + sourceHtml;
    }

    let result: string;
    let succeeded = runWithTempIFrame(contentDocument => {
        contentDocument.open();
        contentDocument.write(sourceHtml);
        contentDocument.close();

        let styleSheets: CSSStyleSheet[] = [];
        for (let i = (additionalStyleNodes ? additionalStyleNodes.length - 1 : -1); i >= 0; i--) {
            styleSheets.push(additionalStyleNodes[i].sheet as CSSStyleSheet);
        }
        for (let i = contentDocument.styleSheets.length - 1; i >= 0; i--) {
            styleSheets.push(contentDocument.styleSheets[i] as CSSStyleSheet);
        }

        for (let styleSheet of styleSheets) {
            for (let j = styleSheet.cssRules.length - 1; j >= 0; j--) {
                // Skip any none-style rule, i.e. @page
                let cssRule = styleSheet.cssRules[j];
                if (cssRule.type != CSSRule.STYLE_RULE) {
                    continue;
                }
                // Make sure the selector is not empty
                let styleRule = cssRule as CSSStyleRule;
                let selectors = styleRule.selectorText ? styleRule.selectorText.split(',') : null;
                if (selectors == null || selectors.length == 0) {
                    continue;
                }
                // Loop through and apply selector one after one
                for (let k = 0; k < selectors.length; k++) {
                    let selector = selectors[k] ? selectors[k].trim() : null;
                    if (selector && !selector.match(PSEUDOSELECTOR_REGEX)) {
                        let elements = contentDocument.body.querySelectorAll(selector);
                        for (let l = 0; l < elements.length; l++) {
                            let element = elements[l] as HTMLElement;

                            // Always put existing styles after so that they have higher priority
                            // Which means if both global style and inline style apply to the same element,
                            // inline style will have higher priority
                            element.setAttribute(
                                'style',
                                styleRule.style.cssText + (element.getAttribute('style') || '')
                            );
                        }
                    }
                }
            }
        }

        // Remove <style> tags in body if any
        forEachElementInQueryResult(contentDocument, STYLE_TAG_FILTER, (element: HTMLElement) => {
            element.parentNode.removeChild(element);
        });
        result = contentDocument.body.innerHTML.trim();
    });

    if (!succeeded) {
        result = convertThroughRegEx(sourceHtml);
    }

    return result;
}
