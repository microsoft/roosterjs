const WORD_HYPHENATION = '--rooster-word-hyphenation';

/**
 * @internal
 */
export function getWordHyphenationRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;
    while ((match = stylePattern.exec(html))) {
        if (!/mso-hyphenate\s*:/i.test(match[1])) {
            continue;
        }
        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-hyphenate\s*:/gi,
            '$1$2' + WORD_HYPHENATION + ':'
        );
        doc.head.appendChild(style);
        if (!style.sheet) {
            throw new Error('Unable to parse Word hyphenation stylesheet');
        }
        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_HYPHENATION).trim().toLowerCase();
                if (value == 'none' || value == 'auto') {
                    rules.push({ selector: cssRule.selectorText, value });
                }
            }
        }
    }
    return rules;
}
