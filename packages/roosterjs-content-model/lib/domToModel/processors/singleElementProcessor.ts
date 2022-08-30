import { ElementProcessor } from './ElementProcessor';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { getProcessor } from './getProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const singleElementProcessor: ElementProcessor = (group, element, context) => {
    const processor =
        getProcessor(element.tagName) ||
        (isBlockElement(element) ? generalBlockProcessor : generalSegmentProcessor);

    processor(group, element, context);
};
