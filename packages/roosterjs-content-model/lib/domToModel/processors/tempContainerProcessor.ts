import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { generalProcessor } from './generalProcessor';
import { getObjectKeys, getStyles, toArray } from 'roosterjs-editor-dom';
import { knownElementProcessor } from './knownElementProcessor';

// Temporarily ignore these attributes and CSS styles since they are processed by format handlers.
// We didn't really process tabindex, vlink, link, but given they don't have too much impact in editor, we can ignore them
const HandledAttributeNames: string[] = [
    'dir',
    'style',
    'bgcolor',
    'tabindex',
    'vlink',
    'link',
    'class',
];
const HandledStyleNames: string[] = [
    'background-color',
    'direction',
    'text-decoration',
    'font-family',
    'font-size',
    'font-style',
    'font-weight',
    'color',
];
// TODO: Put empty array for now, later we will have some change to allow overwrite it
const HandledClassNames: string[] = [];

/**
 * @internal
 * A temp processor to handle DIV and SPAN that don't have any attribute, to reduce unnecessary general blocks/segments
 */
export const tempContainerProcessor: ElementProcessor = (group, element, context) => {
    const processor: ElementProcessor = areAllAttributesProcessed(element)
        ? knownElementProcessor
        : generalProcessor;

    processor(group, element, context);
};

function areAllAttributesProcessed(element: HTMLElement): boolean {
    const attributeNames = toArray(element.attributes).map(a => a.name);
    const classNames = element.className.split(' ');
    const styleNames = getObjectKeys(getStyles(element));

    return (
        attributeNames.every(name => HandledAttributeNames.indexOf(name) >= 0) &&
        classNames.every(name => HandledClassNames.indexOf(name) >= 0) &&
        styleNames.every(name => HandledStyleNames.indexOf(name) >= 0)
    );
}
