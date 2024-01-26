import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
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
    if (
        (model as ContentModelEntity)?.wrapper &&
        isNodeOfType(node, 'ELEMENT_NODE') &&
        isElementOfType(node, 'span') &&
        node.style.width == ONE_HUNDRED_PERCENT &&
        node.style.display == 'inline-block'
    ) {
        node.classList.add(BLOCK_ENTITY_CLASS);
        node.style.display = 'block';
    }
};

/**
 * @internal
 */
export const pasteBlockEntityParser: FormatParser<EntityInfoFormat> = (_, element) => {
    if (element.classList.contains(BLOCK_ENTITY_CLASS)) {
        element.style.display = 'inline-block';
        element.style.width = ONE_HUNDRED_PERCENT;
        element.classList.remove(BLOCK_ENTITY_CLASS);
    }
};
