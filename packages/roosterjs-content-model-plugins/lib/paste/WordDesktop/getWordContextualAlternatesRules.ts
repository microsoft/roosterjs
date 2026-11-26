const WORD_CONTEXTUAL_ALTERNATES_STYLE = '--rooster-word-contextual-alternates';

/**
 * @internal
 * Preserve Word contextual-alternate declarations that the browser removes from stylesheet CSSOM.
 */
export function getWordContextualAlternatesRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;

    while ((match = stylePattern.exec(html))) {
        if (!/mso-contextual-alternates\s*:/i.test(match[1])) {
            continue;
        }

        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-contextual-alternates\s*:/gi,
            '$1$2' + WORD_CONTEXTUAL_ALTERNATES_STYLE + ':'
        );
        doc.head.appendChild(style);

        if (!style.sheet) {
            throw new Error('Unable to parse Word contextual-alternate stylesheet');
        }

        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_CONTEXTUAL_ALTERNATES_STYLE);

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
