import { getStyles } from '../utils/getStyles';
import { getWordNoProofRules } from '../WordDesktop/getWordNoProofRules';
import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordNoProofParser(html: string): FormatParser<ContentModelSegmentFormat> {
    let rules: ReturnType<typeof getWordNoProofRules> | undefined;
    return (format, element) => {
        const standard = element.getAttribute('spellcheck')?.toLowerCase();
        if (standard == '' || standard == 'true' || standard == 'false') {
            return;
        }
        let value = parseNoProof(getStyles(element)['mso-no-proof']);
        if (value === undefined) {
            rules = rules || getWordNoProofRules(html, element.ownerDocument);
            for (let i = rules.length - 1; i >= 0; i--) {
                const ruleValue = parseNoProof(rules[i].value);
                if (ruleValue !== undefined && element.matches(rules[i].selector)) {
                    value = ruleValue;
                    break;
                }
            }
        }
        if (value !== undefined) {
            format.spellCheck = !value;
        }
    };
}

function parseNoProof(value: string | undefined): boolean | undefined {
    switch (value?.trim().toLowerCase()) {
        case 'yes':
            return true;
        case 'no':
            return false;
    }
}
