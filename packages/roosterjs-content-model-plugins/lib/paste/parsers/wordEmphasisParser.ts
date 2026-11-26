import { getStyles } from '../utils/getStyles';
import { getWordFontEmphasisRules } from '../WordDesktop/getWordFontEmphasisRules';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordEmphasisParser(html: string): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordFontEmphasisRules> | undefined;
    return (format, element, _, defaultStyle) => {
        let emphasis = parseWordEmphasis(getStyles(element)['font-emphasize']);
        if (!emphasis) {
            rules = rules || getWordFontEmphasisRules(html, element.ownerDocument);
            for (let i = rules.length - 1; i >= 0; i--) {
                const value = parseWordEmphasis(rules[i].value);
                if (value && element.matches(rules[i].selector)) {
                    emphasis = value;
                    break;
                }
            }
        }
        if (emphasis) {
            if (!element.style.textEmphasisStyle && !defaultStyle.textEmphasisStyle) {
                let source: HTMLElement | null = element;
                let language = '';
                while (source && !language) {
                    language = getStyles(source)['mso-fareast-language'] || '';
                    if (!language) {
                        rules = rules || getWordFontEmphasisRules(html, element.ownerDocument);
                        for (let i = rules.length - 1; i >= 0; i--) {
                            if (rules[i].language && source.matches(rules[i].selector)) {
                                language = rules[i].language.trim();
                                break;
                            }
                        }
                    }
                    language =
                        language ||
                        source.getAttribute('lang') ||
                        source.getAttribute('xml:lang') ||
                        '';
                    source = source.parentElement;
                }
                format.textEmphasisStyle = getMark(
                    emphasis.shape,
                    emphasis.below,
                    language.toLowerCase()
                );
            }
            if (!element.style.textEmphasisPosition && !defaultStyle.textEmphasisPosition) {
                format.textEmphasisPosition = emphasis.below ? 'under right' : 'over right';
            }
        }
    };
}

function parseWordEmphasis(value: string | undefined) {
    const tokens = value?.trim().toLowerCase().split(/\s+/) || [];
    const shapes = tokens.filter(token => /^(?:none|dot|circle|accent)$/.test(token));
    const positions = tokens.filter(token => token == 'above' || token == 'below');
    if (
        shapes.length == 1 &&
        positions.length <= 1 &&
        shapes.length + positions.length == tokens.length
    ) {
        return { shape: shapes[0], below: positions[0] == 'below' };
    }
}

function getMark(shape: string, below: boolean, language: string): string {
    if (shape == 'none') {
        return 'none';
    } else if (shape == 'accent') {
        return '"\u3001"';
    } else if (shape == 'circle') {
        return '"\u02DA"';
    } else if (below || language == 'ja-jp' || language == 'ja' || language == 'zh-cn') {
        return '"\uFF0E"';
    } else if (language == 'ko-kr' || language == 'ko') {
        return '"\u02D9"';
    } else if (language == 'zh-tw') {
        return '"\u2027"';
    }
    // Without the native language context, retain the supplied dot shape, not a guessed glyph.
    return 'filled dot';
}
