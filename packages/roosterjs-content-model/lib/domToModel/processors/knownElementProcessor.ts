import { addBlock } from '../../modelApi/common/addBlock';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    if (isBlockElement(element)) {
        stackFormat(
            context,
            {
                segment: 'shallowClone',
                paragraph: 'shallowClone',
            },
            () => {
                parseFormat(element, context.formatParsers.block, context.blockFormat, context);
                parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

                addBlock(group, createParagraph(false /*isImplicit*/, context.blockFormat));

                context.elementProcessors.child(group, element, context);
            }
        );

        addBlock(group, createParagraph(false /*isImplicit*/, context.blockFormat));
    } else {
        stackFormat(context, { segment: 'shallowClone' }, () => {
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);
            context.elementProcessors.child(group, element, context);
        });
    }
};
