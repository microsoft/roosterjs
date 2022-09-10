import { containerProcessor } from './containerProcessor';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
import { stackFormat } from '../utils/stackFormat';

const FontSizes = ['10px', '13px', '16px', '18px', '24px', '32px', '48px'];

function getFontSize(size: string | null) {
    const intSize = parseInt(size || '');

    if (Number.isNaN(intSize)) {
        return undefined;
    } else if (intSize < 1) {
        return FontSizes[0];
    } else if (intSize > FontSizes.length) {
        return FontSizes[FontSizes.length - 1];
    } else {
        return FontSizes[intSize - 1];
    }
}

/**
 * @internal
 */
export const fontProcessor: ElementProcessor = (group, element, context) => {
    stackFormat(
        context,
        {
            segment: 'shallowClone',
        },
        () => {
            const fontFamily = element.getAttribute('face');
            const fontSize = getFontSize(element.getAttribute('size'));
            const textColor = element.getAttribute('color');
            const format = context.segmentFormat;

            if (fontFamily) {
                format.fontFamily = fontFamily;
            }

            if (fontSize) {
                format.fontSize = fontSize;
            }

            if (textColor) {
                format.textColor = textColor;
            }

            parseFormat(element, SegmentFormatHandlers, context.segmentFormat, context);

            containerProcessor(group, element, context);
        }
    );
};
