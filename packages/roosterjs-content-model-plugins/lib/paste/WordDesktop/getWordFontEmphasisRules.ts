const WORD_FONT_EMPHASIS_STYLE = '--rooster-word-font-emphasis';
const WORD_FONT_EMPHASIS_LANGUAGE = '--rooster-word-emphasis-language';

/**
 * @internal
 * Preserve legacy emphasis declarations that the browser removes from stylesheet CSSOM.
 */
export function getWordFontEmphasisRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string; language: string }[] {
    const rules: { selector: string; value: string; language: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;
    while ((match = stylePattern.exec(html))) {
        if (!/(?:font-emphasize|mso-fareast-language)\s*:/i.test(match[1])) {
            continue;
        }
        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1]
            .replace(/(^|[;{])(\s*)font-emphasize\s*:/gi, '$1$2' + WORD_FONT_EMPHASIS_STYLE + ':')
            .replace(
                /(^|[;{])(\s*)mso-fareast-language\s*:/gi,
                '$1$2' + WORD_FONT_EMPHASIS_LANGUAGE + ':'
            );
        doc.head.appendChild(style);
        if (!style.sheet) {
            throw new Error('Unable to parse Word emphasis stylesheet');
        }
        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_FONT_EMPHASIS_STYLE);
                const language = cssRule.style.getPropertyValue(WORD_FONT_EMPHASIS_LANGUAGE);
                if (value || language) {
                    rules.push({ selector: cssRule.selectorText, value, language });
                }
            }
        }
    }
    return rules;
}
