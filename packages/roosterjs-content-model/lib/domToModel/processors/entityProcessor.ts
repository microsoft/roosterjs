import { addBlock } from '../../modelApi/common/addBlock';
import { addSegment } from '../../modelApi/common/addSegment';
import { createEntity } from '../../modelApi/creators/createEntity';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getEntityFromElement } from 'roosterjs-editor-dom';
import { isBlockElement } from '../utils/isBlockElement';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const entityProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const entity = getEntityFromElement(element);

    if (entity) {
        const isBlockEntity = isBlockElement(element, context);

        stackFormat(
            context,
            { segment: isBlockEntity ? 'shallowCloneForBlock' : undefined },
            () => {
                const entityModel = createEntity(entity, context.segmentFormat);

                if (isBlockEntity) {
                    addBlock(group, entityModel);
                } else {
                    addSegment(group, entityModel);
                }
            }
        );
    }
};
