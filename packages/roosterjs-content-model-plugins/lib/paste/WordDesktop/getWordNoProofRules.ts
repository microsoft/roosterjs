const WORD_NO_PROOF = '--rooster-word-no-proof';

/**
 * @internal
 * Recover the legacy property removed from the browser's stylesheet CSSOM.
 */
export function getWordNoProofRules(
    html: string,
    ownerDocument: Document
): { selector: string; value: string }[] {
    const rules: { selector: string; value: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;
    while ((match = stylePattern.exec(html))) {
        if (!/mso-no-proof\s*:/i.test(match[1])) {
            continue;
        }
        const doc = ownerDocument.implementation.createHTMLDocument('');
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-no-proof\s*:/gi,
            '$1$2' + WORD_NO_PROOF + ':'
        );
        doc.head.appendChild(style);
        if (!style.sheet) {
            throw new Error('Unable to parse Word proofing stylesheet');
        }
        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_NO_PROOF);
                if (value) {
                    rules.push({ selector: cssRule.selectorText, value });
                }
            }
        }
    }
    return rules;
}
