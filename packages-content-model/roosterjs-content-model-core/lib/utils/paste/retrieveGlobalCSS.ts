import { toArray } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function retrieveGlobalCss(doc: Document, rules: CSSStyleRule[]) {
    const styles = toArray(doc.querySelectorAll('style'));

    styles.forEach(styleNode => {
        const sheet = styleNode.sheet as CSSStyleSheet;

        for (let ruleIndex = 0; ruleIndex < sheet.cssRules.length; ruleIndex++) {
            const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;

            if (rule.type == CSSRule.STYLE_RULE && rule.selectorText) {
                rules.push(rule);
            }
        }
    });
}
