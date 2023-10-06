import { addBlock } from '../../modelApi/common/addBlock';
import { addSegment } from '../../modelApi/common/addSegment';
import { createEntity } from '../../modelApi/creators/createEntity';
import { isBlockElement } from '../utils/isBlockElement';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * Content Model Element Processor for entity
 * @param group The parent block group
 * @param parent Parent DOM node to process
 * @param context DOM to Content Model context
 */
export const entityProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const isBlockEntity = isBlockElement(element, context);

    stackFormat(
        context,
        { segment: isBlockEntity ? 'empty' : undefined, paragraph: 'empty' },
        () => {
            const entityModel = createEntity(element, true /*isReadonly*/, context.segmentFormat);

            parseFormat(element, context.formatParsers.entity, entityModel.entityFormat, context);

            // TODO: Need to handle selection for editable entity
            if (context.isInSelection) {
                entityModel.isSelected = true;
            }

            if (isBlockEntity) {
                addBlock(group, entityModel);
            } else {
                const paragraph = addSegment(group, entityModel);
                context.domIndexer?.onSegment(element, paragraph, [entityModel]);
            }
        }
    );
};
