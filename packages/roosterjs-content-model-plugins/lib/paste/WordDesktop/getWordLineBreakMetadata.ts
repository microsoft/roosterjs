const WORD_LINE_BREAK_OVERRIDE = '--rooster-word-line-break-override';

/**
 * @internal
 */
export function getWordLineBreakMetadata(html: string, ownerDocument: Document) {
    const doc = ownerDocument.implementation.createHTMLDocument('');
    const bodyTag = html.match(/<body\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/i)?.[0] || '';
    const bodyStyle = bodyTag.match(/\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const body = doc.createElement('div');
    body.style.cssText = bodyStyle?.[1] || bodyStyle?.[2] || bodyStyle?.[3] || '';
    const lineBreak = body.style.getPropertyValue('line-break');
    const overrides: { selector: string; value: string }[] = [];
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
    let match: RegExpExecArray | null;
    while ((match = stylePattern.exec(html))) {
        if (!/mso-line-break-override\s*:/i.test(match[1])) {
            continue;
        }
        const style = doc.createElement('style');
        style.textContent = match[1].replace(
            /(^|[;{])(\s*)mso-line-break-override\s*:/gi,
            '$1$2' + WORD_LINE_BREAK_OVERRIDE + ':'
        );
        doc.head.appendChild(style);
        if (!style.sheet) {
            throw new Error('Unable to parse Word line-breaking stylesheet');
        }
        for (const rule of Array.from(style.sheet.cssRules)) {
            if (rule.type == CSSRule.STYLE_RULE) {
                const cssRule = rule as CSSStyleRule;
                const value = cssRule.style.getPropertyValue(WORD_LINE_BREAK_OVERRIDE).trim();
                if (value) {
                    overrides.push({ selector: cssRule.selectorText, value });
                }
            }
        }
    }
    return { lineBreak, overrides };
}
