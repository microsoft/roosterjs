import { addBlock } from '../../modelApi/common/addBlock';
import { addSegment } from '../../modelApi/common/addSegment';
import { createEntity } from '../../modelApi/creators/createEntity';
import { ElementProcessor } from 'roosterjs-content-model-types';
import { getEntityFromElement } from 'roosterjs-editor-dom';
import { isBlockElement } from '../utils/isBlockElement';
import { stackFormat } from '../utils/stackFormat';

/**
 * Content Model Element Processor for entity
 * @param group The parent block group
 * @param parent Parent DOM node to process
 * @param context DOM to Content Model context
 */
export const entityProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const entity = getEntityFromElement(element);

    // In Content Model we also treat read only element as an entity since we cannot edit it
    const { id, type, isReadonly } = entity || { isReadonly: true };
    const isBlockEntity = isBlockElement(element, context);

    stackFormat(
        context,
        { segment: isBlockEntity ? 'empty' : undefined, paragraph: 'empty' },
        () => {
            const entityModel = createEntity(element, isReadonly, type, context.segmentFormat, id);

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
