import { addBlock } from '../../modelApi/common/addBlock';
import { addSegment } from '../../modelApi/common/addSegment';
import { createEntity } from '../../modelApi/creators/createEntity';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getEntityFromElement, isBlockElement } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const entityProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const entity = getEntityFromElement(element);

    if (entity) {
        const entityModel = createEntity(entity, context.segmentFormat);
        const isBlockEntity = isBlockElement(element, context);

        if (isBlockEntity) {
            addBlock(group, entityModel);
        } else {
            addSegment(group, entityModel);
        }
    }
};
