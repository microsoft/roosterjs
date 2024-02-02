import { addDelimiters, isBlockElement, isNodeOfType } from 'roosterjs-content-model-dom';
import type {
    ContentModelEntity,
    EntityInfoFormat,
    FormatParser,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

const BLOCK_ENTITY_CLASS = '_EBlock';
const ONE_HUNDRED_PERCENT = '100%';

/**
 * @internal
 */
export const onCreateCopyEntityNode: OnNodeCreated = (model, node) => {
    const entityModel = model as ContentModelEntity;
    if (
        entityModel &&
        entityModel.wrapper &&
        entityModel.segmentType == 'Entity' &&
        isNodeOfType(node, 'ELEMENT_NODE') &&
        isBlockElement(entityModel.wrapper)
    ) {
        node.classList.add(BLOCK_ENTITY_CLASS);
        const innerEntity = node.querySelector('._Entity');
        if (innerEntity) {
            node.style.display = 'block';
        }
    }
};

/**
 * @internal
 */
export const pasteBlockEntityParser: FormatParser<EntityInfoFormat> = (_, element) => {
    if (element.classList.contains(BLOCK_ENTITY_CLASS)) {
        element.classList.remove(BLOCK_ENTITY_CLASS);

        const innerEntity = element.querySelector('._Entity');
        if (isNodeOfType(innerEntity, 'ELEMENT_NODE')) {
            innerEntity.style.display = 'inline-block';
            innerEntity.style.width = ONE_HUNDRED_PERCENT;
            addDelimiters(element.ownerDocument, innerEntity);
        }
    }
};
