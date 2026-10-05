import type { CssRule } from 'roosterjs-content-model-types';

/**
 * CSS class selectors used by Word Desktop to mark list paragraph elements.
 * Word emits global CSS rules that apply margins to these classes, which we want
 * to suppress so that RoosterJS list indentation logic is used instead.
 */
const WORD_LIST_PARAGRAPH_SELECTORS = new Set([
    'p.MsoListParagraph',
    'p.MsoListParagraphCxSpFirst',
    'p.MsoListParagraphCxSpMiddle',
    'p.MsoListParagraphCxSpLast',
    'div.MsoListParagraph',
    'div.MsoListParagraphCxSpFirst',
    'div.MsoListParagraphCxSpMiddle',
    'div.MsoListParagraphCxSpLast',
]);

/**
 * @internal
 * Strips horizontal margin properties from a CSS property string while preserving
 * vertical values from the margin shorthand.
 * Empty tokens produced by a trailing semicolon are preserved so that the
 * resulting string still ends with ";" and remains safe to concatenate.
 * For example, "margin: 1pt 2pt 3pt 4pt; color: red;" becomes
 * "margin-top: 1pt; margin-bottom: 3pt; color: red;".
 */
function removeHorizontalMarginProperties(cssText: string): string {
    const result: string[] = [];

    cssText.split(';').forEach(prop => {
        const separatorIndex = prop.indexOf(':');
        const name = prop
            .substring(0, separatorIndex < 0 ? prop.length : separatorIndex)
            .trim()
            .toLowerCase();

        if (
            name == 'margin-left' ||
            name == 'margin-right' ||
            name == 'margin-inline' ||
            name == 'margin-inline-start' ||
            name == 'margin-inline-end'
        ) {
            return;
        }

        if (name == 'margin' && separatorIndex >= 0) {
            const value = prop.substring(separatorIndex + 1).trim();
            const importantMatch = value.match(/\s*!important\s*$/i);
            const important = importantMatch ? ' !important' : '';
            const values = splitCssValue(value.substring(0, importantMatch?.index ?? value.length));

            if (values.length >= 1 && values.length <= 4) {
                const leadingWhitespace = prop.match(/^\s*/)?.[0] || '';
                const top = values[0];
                const bottom = values.length >= 3 ? values[2] : values[0];

                result.push(`${leadingWhitespace}margin-top: ${top}${important}`);
                result.push(` margin-bottom: ${bottom}${important}`);
                return;
            }
        }

        result.push(prop);
    });

    return result.join(';');
}

function splitCssValue(value: string): string[] {
    const result: string[] = [];
    let current = '';
    let quote: string | null = null;
    let parenthesisDepth = 0;

    for (let i = 0; i < value.length; i++) {
        const char = value[i];

        if (quote) {
            current += char;

            if (char == '\\') {
                i++;
                current += value[i] || '';
            } else if (char == quote) {
                quote = null;
            }
        } else if (char == '"' || char == "'") {
            current += char;
            quote = char;
        } else if (char == '(') {
            current += char;
            parenthesisDepth++;
        } else if (char == ')') {
            current += char;
            parenthesisDepth = Math.max(0, parenthesisDepth - 1);
        } else if (parenthesisDepth == 0 && /\s/.test(char)) {
            if (current) {
                result.push(current);
                current = '';
            }
        } else {
            current += char;
        }
    }

    if (current) {
        result.push(current);
    }

    return result;
}

/**
 * @internal
 * Removes horizontal margin properties from global CSS rules that target Word list
 * paragraph classes (p.MsoListParagraph, p.MsoListParagraphCxSpFirst, etc.).
 *
 * Word Desktop pastes a global stylesheet that typically includes rules like:
 *   p.MsoListParagraph { margin: 0in; margin-bottom: .0001pt; ... }
 * Horizontal margins conflict with RoosterJS's own list indentation, causing double
 * indentation when the CSS is converted to inline styles via convertInlineCss. The
 * vertical margins are preserved so Word's margin-top: 0 is not replaced by the
 * browser's default paragraph margin when the list level is created.
 *
 * When a rule's selectors are exclusively list paragraph classes the horizontal
 * margins are removed in place. When a rule groups list paragraph classes with other
 * selectors the rule is split: the non-list selectors keep the original text, and a
 * new rule is inserted for the list paragraph selectors with horizontal margins
 * stripped.
 *
 * The array is mutated in place so the changes are reflected when convertInlineCss
 * subsequently processes the same array reference.
 */
export function removeListParagraphMargins(globalCssRules: CssRule[]): void {
    // Iterate in reverse so that splice insertions don't shift unvisited indices.
    for (let i = globalCssRules.length - 1; i >= 0; i--) {
        const rule = globalCssRules[i];
        const matchingSelectors = rule.selectors.filter(s => WORD_LIST_PARAGRAPH_SELECTORS.has(s));

        if (matchingSelectors.length === 0) {
            continue;
        }

        const nonMatchingSelectors = rule.selectors.filter(
            s => !WORD_LIST_PARAGRAPH_SELECTORS.has(s)
        );

        if (nonMatchingSelectors.length === 0) {
            // All selectors target list paragraphs — strip horizontal margins directly.
            rule.text = removeHorizontalMarginProperties(rule.text);
        } else {
            // Mixed rule: keep the non-list selectors on the original entry, then
            // insert a new entry immediately after for the list paragraph selectors.
            rule.selectors = nonMatchingSelectors;
            globalCssRules.splice(i + 1, 0, {
                selectors: matchingSelectors,
                text: removeHorizontalMarginProperties(rule.text),
            });
        }
    }
}
