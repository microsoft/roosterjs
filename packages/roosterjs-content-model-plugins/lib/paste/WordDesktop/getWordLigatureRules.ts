const WORD_LIGATURES_STYLE = '--rooster-word-ligatures';

/**
 * @internal
 * Preserve Word ligature declarations that the browser removes from stylesheet CSSOM.
 */
export function getWordLigatureRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;

    while ((match = stylePattern.exec(html))) {
        if (!/mso-ligatures\s*:/i.test(match[1])) {
            continue;
        }

        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-ligatures\s*:/gi,
            '$1$2' + WORD_LIGATURES_STYLE + ':'
        );
        doc.head.appendChild(style);

        if (!style.sheet) {
            throw new Error('Unable to parse Word ligature stylesheet');
        }

        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_LIGATURES_STYLE);

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
