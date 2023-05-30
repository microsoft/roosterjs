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
    const { id, type, isReadonly } = entity || { isReadonly: true };
    const isBlockEntity = isBlockElement(element, context);

    stackFormat(
        context,
        { segment: isBlockEntity ? 'empty' : undefined, paragraph: 'empty' },
        () => {
            const wrapperToUse = context.allowCacheElement
                ? element
                : (element.cloneNode(true /* deep */) as HTMLElement);

            if (!context.allowCacheElement) {
                wrapperToUse.style.backgroundColor = element.style.backgroundColor || 'inherit';
                wrapperToUse.style.color = element.style.color || 'inherit';
            }

            const entityModel = createEntity(
                wrapperToUse,
                isReadonly,
                context.segmentFormat,
                id,
                type
            );

            // TODO: Need to handle selection for editable entity
            if (context.isInSelection) {
                entityModel.isSelected = true;
            }

            if (isBlockEntity) {
                addBlock(group, entityModel);
            } else {
                addSegment(group, entityModel);
            }
        }
    );
};
