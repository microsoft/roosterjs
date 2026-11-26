const WORD_NUMBER_SPACING_STYLE = '--rooster-word-number-spacing';

/**
 * @internal
 * Recover Word properties discarded by stylesheet CSSOM.
 */
export function getWordNumberSpacingRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const pattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html))) {
        if (!/mso-number-spacing\s*:/i.test(match[1])) {
            continue;
        }
        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-number-spacing\s*:/gi,
            '$1$2' + WORD_NUMBER_SPACING_STYLE + ':'
        );
        doc.head.appendChild(style);
        if (!style.sheet) {
            throw new Error('Unable to parse Word numeric-spacing stylesheet');
        }
        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_NUMBER_SPACING_STYLE);
                if (value) {
                    rules.push({ selector: cssRule.selectorText, value });
                }
            }
        }
    }
    return rules;
}
