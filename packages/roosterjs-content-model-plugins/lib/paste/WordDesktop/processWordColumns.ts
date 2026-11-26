/**
 * @internal
 */
export function createWordColumnProcessor(html: string) {
    let columns: Map<string, RegExpMatchArray> | undefined;
    return (element: HTMLElement) => {
        const page = element.style.getPropertyValue('page').trim();
        if (!page) {
            return;
        }
        if (!columns) {
            columns = new Map();
            const pattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(html))) {
                const doc = element.ownerDocument.implementation.createHTMLDocument('');
                const style = doc.createElement('style');
                // Custom declarations are discarded inside @page, so parse named pages as rules.
                style.textContent = match[1]
                    .replace(/@page\s+([\w-]+)\s*\{/gi, '.rooster-word-page-$1{')
                    .replace(/(^|[;{])(\s*)mso-columns\s*:/gi, '$1$2--rooster-word-columns:');
                doc.head.appendChild(style);
                if (!style.sheet) {
                    throw new Error('Unable to parse Word section stylesheet');
                }
                for (const rule of Array.from(style.sheet.cssRules)) {
                    if (rule.type == CSSRule.STYLE_RULE) {
                        const pageRule = rule as CSSStyleRule;
                        const value = pageRule.style
                            .getPropertyValue('--rooster-word-columns')
                            .trim();
                        const parsed = value.match(
                            /^([1-9]\d*)\s+even\s+((?:\d+(?:\.\d+)?|\.\d+)(?:pt|in|cm|mm|pc|px))$/i
                        );
                        const name = pageRule.selectorText.match(
                            /^\.rooster-word-page-([\w-]+)$/
                        )?.[1];
                        if (name && value) {
                            columns.delete(name);
                            if (parsed && Number.isSafeInteger(Number(parsed[1]))) {
                                columns.set(name, parsed);
                            }
                        }
                    }
                }
            }
        }
        const value = columns.get(page);
        if (value) {
            if (!element.style.columnCount) {
                element.style.columnCount = value[1];
            }
            if (!element.style.columnGap) {
                element.style.columnGap = value[2];
            }
        }
    };
}
