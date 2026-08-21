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
 * Strips all margin-* properties from a CSS property string.
 * Empty tokens produced by a trailing semicolon are preserved so that the
 * resulting string still ends with ";" and remains safe to concatenate.
 * For example, "margin-top: 0pt; color: red;" becomes " color: red;".
 */
function removeMarginProperties(cssText: string): string {
    return cssText
        .split(';')
        .filter(prop => {
            const name = prop.split(':')[0].trim().toLowerCase();
            // Keep empty tokens (the trailing ';' produces one) and any non-margin property.
            return !name || !/^margin/.test(name);
        })
        .join(';');
}

/**
 * @internal
 * Removes margin properties from global CSS rules that target Word list paragraph
 * classes (p.MsoListParagraph, p.MsoListParagraphCxSpFirst, etc.).
 *
 * Word Desktop pastes a global stylesheet that typically includes rules like:
 *   p.MsoListParagraph { margin: 0in; margin-bottom: .0001pt; ... }
 * These margins conflict with RoosterJS's own list indentation, causing double
 * indentation when the CSS is converted to inline styles via convertInlineCss.
 *
 * When a rule's selectors are exclusively list paragraph classes the margins are
 * removed in place.  When a rule groups list paragraph classes with other selectors
 * the rule is split: the non-list selectors keep the original text, and a new rule
 * is inserted for the list paragraph selectors with margins stripped.
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
            // All selectors target list paragraphs — strip margins directly.
            rule.text = removeMarginProperties(rule.text);
        } else {
            // Mixed rule: keep the non-list selectors on the original entry, then
            // insert a new entry immediately after for the list paragraph selectors
            // with margins removed.
            rule.selectors = nonMatchingSelectors;
            globalCssRules.splice(i + 1, 0, {
                selectors: matchingSelectors,
                text: removeMarginProperties(rule.text),
            });
        }
    }
}
