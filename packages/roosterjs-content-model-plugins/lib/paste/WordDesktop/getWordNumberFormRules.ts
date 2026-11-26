const WORD_NUMBER_FORM_STYLE = '--rooster-word-number-form';

/**
 * @internal
 * Recover Word properties discarded by stylesheet CSSOM.
 */
export function getWordNumberFormRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const pattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html))) {
        if (!/mso-number-form\s*:/i.test(match[1])) {
            continue;
        }
        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-number-form\s*:/gi,
            '$1$2' + WORD_NUMBER_FORM_STYLE + ':'
        );
        doc.head.appendChild(style);
        if (!style.sheet) {
            throw new Error('Unable to parse Word numeral-form stylesheet');
        }
        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_NUMBER_FORM_STYLE);
                if (value) {
                    rules.push({ selector: cssRule.selectorText, value });
                }
            }
        }
    }
    return rules;
}
