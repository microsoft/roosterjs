import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getObjectKeys, getStyles, toArray } from 'roosterjs-editor-dom';
import { knownElementProcessor } from './knownElementProcessor';

// Temporarily ignore these attributes and CSS styles since they are processed by format handlers.
// We didn't really process tabindex, vlink, link, but given they don't have too much impact in editor, we can ignore them
const HandledAttributeNames = ['dir', 'style', 'bgcolor', 'tabindex', 'vlink', 'link', 'class'];
const HandledStyleNames = [
    'background-color',
    'direction',
    'text-decoration',
    'font-family',
    'font-size',
    'font-style',
    'font-weight',
    'color',
];

// Put empty array for now, later we will have some change to allow overwrite it
const HandledClassNames = [''];

/**
 * @internal
 * Create a temp processor to handle DIV and SPAN that don't have any attribute, to reduce unnecessary general blocks/segments
 */
export function createTempContainerProcessor<T extends HTMLElement>(
    additionalHandleClassNames: string[] = [],
    additionalHandledStyleNames: string[] = [],
    additionalHandledAttributes: string[] = []
): ElementProcessor<T> {
    const handledAttributeNames = HandledAttributeNames.concat(additionalHandledAttributes);
    const handledStyleNames = HandledStyleNames.concat(additionalHandledStyleNames);
    const handledClassNames = HandledClassNames.concat(additionalHandleClassNames);

    return (group, element, context) => {
        const attributeNames = toArray(element.attributes).map(a => a.name);
        const classNames = element.className.split(' ');
        const styleNames = getObjectKeys(getStyles(element));

        const allAttributesProcessed =
            attributeNames.every(name => handledAttributeNames.indexOf(name) >= 0) &&
            styleNames.every(name => handledStyleNames.indexOf(name) >= 0) &&
            classNames.every(name => handledClassNames.indexOf(name) >= 0);

        const processor = allAttributesProcessed
            ? knownElementProcessor
            : context.elementProcessors['*'];

        processor(group, element, context);
    };
}
