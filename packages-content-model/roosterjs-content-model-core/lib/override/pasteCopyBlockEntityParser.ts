import { isBlockElement, isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import type {
    ContentModelEntity,
    EntityInfoFormat,
    FormatParser,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

const BlockEntityClass = '_EBlock';
const OneHundredPercent = '100%';
const InlineBlock = 'inline-block';

/**
 * @internal
 */
export const onCreateCopyEntityNode: OnNodeCreated = (model, node) => {
    const entityModel = model as ContentModelEntity;
    if (
        entityModel &&
        entityModel.wrapper &&
        entityModel.blockType == 'Entity' &&
        isNodeOfType(node, 'ELEMENT_NODE') &&
        isElementOfType(node, 'div') &&
        !isBlockElement(entityModel.wrapper) &&
        entityModel.wrapper.style.display == InlineBlock &&
        entityModel.wrapper.style.width == OneHundredPercent
    ) {
        node.classList.add(BlockEntityClass);
        node.style.display = 'block';
        node.style.width = '';
    }
};

/**
 * @internal
 */
export const pasteBlockEntityParser: FormatParser<EntityInfoFormat> = (_, element) => {
    if (element.classList.contains(BlockEntityClass)) {
        element.classList.remove(BlockEntityClass);
        element.style.display = InlineBlock;
        element.style.width = OneHundredPercent;
    }
};
