import { addBlock } from '../../modelApi/common/addBlock';
import { containerProcessor } from './containerProcessor';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor = (group, element, context) => {
    if (isBlockElement(element)) {
        stackFormat(
            context,
            {
                segment: 'shallowClone',
            },
            () => {
                parseFormat(element, SegmentFormatHandlers, context.segmentFormat, context);

                addBlock(group, createParagraph(false /*isImplicit*/));

                containerProcessor(group, element, context);
            }
        );

        addBlock(group, createParagraph(false /*isImplicit*/));
    } else {
        stackFormat(context, { segment: 'shallowClone' }, () => {
            parseFormat(element, SegmentFormatHandlers, context.segmentFormat, context);
            containerProcessor(group, element, context);
        });
    }
};
