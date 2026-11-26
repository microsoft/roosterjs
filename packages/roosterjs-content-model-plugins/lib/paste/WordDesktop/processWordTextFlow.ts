/**
 * @internal
 */
export function createWordTextFlowProcessor(html: string) {
    let pages: Map<string, string> | undefined;
    return (element: HTMLElement) => {
        const page = element.style.getPropertyValue('page').trim();
        if (!page || element.style.writingMode) {
            return;
        }
        if (!pages) {
            pages = new Map();
            const pattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(html))) {
                const doc = element.ownerDocument.implementation.createHTMLDocument('');
                const style = doc.createElement('style');
                // writing-mode is discarded inside @page; recover simple named sections as rules.
                style.textContent = match[1].replace(
                    /@page\s+([\w-]+)\s*\{/gi,
                    '.rooster-word-page-$1{'
                );
                doc.head.appendChild(style);
                if (!style.sheet) {
                    throw new Error('Unable to parse Word section text flow stylesheet');
                }
                for (const rule of Array.from(style.sheet.cssRules)) {
                    if (rule.type == CSSRule.STYLE_RULE) {
                        const pageRule = rule as CSSStyleRule;
                        const name = pageRule.selectorText.match(
                            /^\.rooster-word-page-([\w-]+)$/
                        )?.[1];
                        if (name && pageRule.style.writingMode) {
                            pages.set(name, pageRule.style.writingMode);
                        }
                    }
                }
            }
        }
        const value = pages.get(page);
        if (value) {
            element.style.writingMode = value;
        }
    };
}
