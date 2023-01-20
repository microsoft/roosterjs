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

    // In Content Model we also treat read only element as an entity since we cannot edit it
    if (entity || element.contentEditable == 'false') {
        const { id, type, isReadonly } = entity || {};
        const isBlockEntity = isBlockElement(element, context);

        stackFormat(
            context,
            { segment: isBlockEntity ? 'shallowCloneForBlock' : undefined },
            () => {
                const entityModel = createEntity(
                    element,
                    context.segmentFormat,
                    id,
                    type,
                    isReadonly
                );

                if (isBlockEntity) {
                    addBlock(group, entityModel);
                } else {
                    addSegment(group, entityModel);
                }
            }
        );
    }
};
