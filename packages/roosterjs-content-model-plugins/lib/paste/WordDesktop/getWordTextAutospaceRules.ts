const WORD_TEXT_AUTOSPACE = '--rooster-word-text-autospace';

/**
 * @internal
 * Preserve Word values that the browser removes from stylesheet CSSOM.
 */
export function getWordTextAutospaceRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;
    while ((match = stylePattern.exec(html))) {
        if (!/text-autospace\s*:/i.test(match[1])) {
            continue;
        }
        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)text-autospace\s*:/gi,
            '$1$2' + WORD_TEXT_AUTOSPACE + ':'
        );
        doc.head.appendChild(style);
        if (!style.sheet) {
            throw new Error('Unable to parse Word automatic-spacing stylesheet');
        }
        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_TEXT_AUTOSPACE);
                if (value) {
                    rules.push({ selector: cssRule.selectorText, value });
                }
            }
        }
    }
    return rules;
}
