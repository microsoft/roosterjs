import { getStyles } from '../utils/getStyles';

/**
 * @internal
 * Recover native descriptors discarded by the browser's CSS parser.
 */
export function createWordCssLookup(html: string, names: string[]) {
    let rules: { selector: string; styles: Record<string, string> }[] | undefined;
    const declaration = new RegExp('(^|[;{])(\\s*)(' + names.join('|') + ')\\s*:', 'gi');
    return (element: HTMLElement): Record<string, string> => {
        if (!rules) {
            rules = [];
            const pattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(html))) {
                const doc = element.ownerDocument.implementation.createHTMLDocument('');
                const style = doc.createElement('style');
                style.textContent = match[1].replace(declaration, '$1$2--rooster-$3:');
                doc.head.appendChild(style);
                if (!style.sheet) {
                    throw new Error('Unable to parse Word descriptor stylesheet');
                }
                for (const rule of Array.from(style.sheet.cssRules)) {
                    if (rule.type == CSSRule.STYLE_RULE) {
                        const css = rule as CSSStyleRule;
                        const styles: Record<string, string> = {};
                        names.forEach(name => {
                            const value = css.style.getPropertyValue('--rooster-' + name).trim();
                            if (value) {
                                styles[name] = value;
                            }
                        });
                        if (Object.keys(styles).length) {
                            rules.push({ selector: css.selectorText, styles });
                        }
                    }
                }
            }
        }
        const result: Record<string, string> = {};
        rules.forEach(rule => {
            if (element.matches(rule.selector)) {
                Object.assign(result, rule.styles);
            }
        });
        const inline = getStyles(element);
        Object.keys(inline).forEach(name => (result[name.toLowerCase()] = inline[name]));
        return result;
    };
}
