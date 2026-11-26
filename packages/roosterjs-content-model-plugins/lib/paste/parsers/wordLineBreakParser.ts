import { getStyles } from '../utils/getStyles';
import { getWordLineBreakMetadata } from '../WordDesktop/getWordLineBreakMetadata';
import type { FormatParser, LineBreakFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createWordLineBreakParser(html: string): FormatParser<LineBreakFormat> {
    let metadata: ReturnType<typeof getWordLineBreakMetadata> | undefined;
    return (format, element, _, defaultStyle) => {
        if (
            !/^(?:P|H[1-6]|LI|TD|TH)$/.test(element.tagName) ||
            element.style.getPropertyValue('line-break') ||
            defaultStyle.lineBreak
        ) {
            return;
        }
        metadata = metadata || getWordLineBreakMetadata(html, element.ownerDocument);
        if (!metadata.lineBreak) {
            return;
        }
        let override = getStyles(element)['mso-line-break-override'];
        if (!override) {
            for (let i = metadata.overrides.length - 1; i >= 0; i--) {
                if (element.matches(metadata.overrides[i].selector)) {
                    override = metadata.overrides[i].value;
                    break;
                }
            }
        }
        if (override?.trim().toLowerCase() == 'restrictions') {
            // This legacy opt-out is not equivalent to modern anywhere/loose rules.
            format.lineBreak = 'revert';
            return;
        }
        let ancestor = element.parentElement;
        while (ancestor) {
            const value = ancestor.style.getPropertyValue('line-break');
            if (value && value != 'inherit' && value != 'unset') {
                format.lineBreak = value;
                return;
            }
            ancestor = ancestor.parentElement;
        }
        format.lineBreak = metadata.lineBreak;
    };
}
