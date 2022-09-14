import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const singleElementProcessor: ElementProcessor = (group, element, context) => {
    const processor =
        context.elementProcessors[element.tagName] ||
        (isBlockElement(element) ? generalBlockProcessor : generalSegmentProcessor);

    processor(group, element, context);
};
