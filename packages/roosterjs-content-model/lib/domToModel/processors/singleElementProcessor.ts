import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { generalProcessor } from './generalProcessor';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const singleElementProcessor: ElementProcessor = (group, element, context) => {
    const processor = context.elementProcessors[element.tagName] || generalProcessor;
    processor(group, element, context);
};
