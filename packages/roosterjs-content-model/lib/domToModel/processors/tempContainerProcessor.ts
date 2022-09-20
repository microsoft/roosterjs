import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { generalProcessor } from './generalProcessor';
import { knownElementProcessor } from './knownElementProcessor';

/**
 * @internal
 * A temp processor to handle DIV and SPAN that don't have any attribute, to reduce unnecessary general blocks/segments
 */
export const tempContainerProcessor: ElementProcessor = (group, element, context) => {
    const processor: ElementProcessor =
        element.attributes.length == 0 ? knownElementProcessor : generalProcessor;

    processor(group, element, context);
};
