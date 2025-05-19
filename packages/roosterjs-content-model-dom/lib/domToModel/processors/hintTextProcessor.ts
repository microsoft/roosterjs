import { ensureParagraph } from '../../modelApi/common/ensureParagraph';
import { getHintText } from '../../domUtils/hiddenProperties/hintText';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const hintTextProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const paragraph = ensureParagraph(group, context.blockFormat);
    const lastSegment = paragraph.segments[paragraph.segments.length - 1];

    if (lastSegment?.segmentType == 'SelectionMarker') {
        const hintText = getHintText(element);

        if (hintText) {
            lastSegment.hintText = hintText;
        }
    }
};
