const WORD_STYLISTIC_SET_STYLE = '--rooster-word-stylistic-set';

/**
 * @internal
 * Preserve Word stylistic-set declarations that the browser removes from stylesheet CSSOM.
 */
export function getWordStylisticSetRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;

    while ((match = stylePattern.exec(html))) {
        if (!/mso-stylistic-set\s*:/i.test(match[1])) {
            continue;
        }

        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-stylistic-set\s*:/gi,
            '$1$2' + WORD_STYLISTIC_SET_STYLE + ':'
        );
        doc.head.appendChild(style);

        if (!style.sheet) {
            throw new Error('Unable to parse Word stylistic-set stylesheet');
        }

        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_STYLISTIC_SET_STYLE);

                if (value) {
                    rules.push({
                        selector: cssRule.selectorText,
                        value,
                    });
                }
            }
        }
    }
    return rules;
}
