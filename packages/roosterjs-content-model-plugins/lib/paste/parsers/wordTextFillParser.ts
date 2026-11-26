import { getStyles } from '../utils/getStyles';
import type { FormatParser, TextColorFormat } from 'roosterjs-content-model-types';

const properties = [
    'mso-style-textfill-type',
    'mso-style-textfill-fill-color',
    'mso-style-textfill-fill-alpha',
];

/**
 * @internal
 */
export function createWordTextFillParser(html: string): FormatParser<TextColorFormat> {
    let rules: { selector: string; styles: Record<string, string> }[] | undefined;
    return (format, element) => {
        if (element.style.getPropertyValue('-webkit-text-fill-color')) {
            return;
        }
        if (!rules) {
            rules = [];
            const pattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(html))) {
                const doc = element.ownerDocument.implementation.createHTMLDocument('');
                const style = doc.createElement('style');
                style.textContent = match[1].replace(
                    /(^|[;{])(\s*)(mso-style-textfill-(?:type|fill-color|fill-alpha))\s*:/gi,
                    '$1$2--$3:'
                );
                doc.head.appendChild(style);
                if (!style.sheet) {
                    throw new Error('Unable to parse Word text fill stylesheet');
                }
                for (const rule of Array.from(style.sheet.cssRules)) {
                    if (rule.type == CSSRule.STYLE_RULE) {
                        const css = rule as CSSStyleRule;
                        const styles: Record<string, string> = {};
                        properties.forEach(name => {
                            const value = css.style.getPropertyValue('--' + name).trim();
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
        const styles: Record<string, string> = {};
        rules.forEach(rule => {
            if (element.matches(rule.selector)) {
                Object.assign(styles, rule.styles);
            }
        });
        Object.assign(styles, getStyles(element));
        const type = styles[properties[0]]?.toLowerCase();
        if (type == 'none') {
            format.textFillColor = 'transparent';
        } else if (!type || type == 'solid') {
            const color = styles[properties[1]];
            const alpha = styles[properties[2]];
            // Only resolved native RGB colors are translated; theme transforms are already baked in.
            if (
                /^#[0-9a-f]{6}$/i.test(color || '') &&
                (!alpha || /^(?:100|[0-9]{1,2})(?:\.[0-9]+)?%$/.test(alpha))
            ) {
                const opacity = alpha ? parseFloat(alpha) / 100 : 1;
                if (opacity <= 1) {
                    const rgb = [1, 3, 5].map(start => parseInt(color.substr(start, 2), 16));
                    format.textFillColor = `rgba(${rgb.join(', ')}, ${opacity})`;
                }
            }
        }
    };
}
