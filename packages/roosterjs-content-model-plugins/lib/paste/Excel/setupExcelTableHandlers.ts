import { addParser } from '../utils/addParser';
import { setProcessor } from '../utils/setProcessor';
import type { BeforePasteEvent, ElementProcessor } from 'roosterjs-content-model-types';

const DEFAULT_BORDER_STYLE = 'solid 1px #d4d4d4';

/**
 * @internal
 */
export function setupExcelTableHandlers(
    event: BeforePasteEvent,
    allowExcelNoBorderTable: boolean | undefined,
    handleForNativeEvent: boolean
) {
    addParser(event.domToModelOption, 'tableCell', (format, element) => {
        if (
            !allowExcelNoBorderTable &&
            (element.style.borderStyle === 'none' ||
                (!handleForNativeEvent && element.style.borderStyle == ''))
        ) {
            format.borderBottom = DEFAULT_BORDER_STYLE;
            format.borderLeft = DEFAULT_BORDER_STYLE;
            format.borderRight = DEFAULT_BORDER_STYLE;
            format.borderTop = DEFAULT_BORDER_STYLE;
        }
    });

    setProcessor(event.domToModelOption, 'child', childProcessor);
}

/**
 * @internal
 * Exported only for unit test
 */
export const childProcessor: ElementProcessor<ParentNode> = (group, element, context) => {
    const segmentFormat = { ...context.segmentFormat };
    if (
        group.blockGroupType === 'TableCell' &&
        group.format.textColor &&
        !context.segmentFormat.textColor
    ) {
        context.segmentFormat.textColor = group.format.textColor;
    }

    context.defaultElementProcessors.child(group, element, context);

    if (group.blockGroupType === 'TableCell' && group.format.textColor) {
        context.segmentFormat = segmentFormat;
        delete group.format.textColor;
    }
};
