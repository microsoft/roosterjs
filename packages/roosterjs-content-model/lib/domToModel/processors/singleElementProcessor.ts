import { brProcessor } from './brProcessor';
import { containerProcessor } from './containerProcessor';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
import { stackFormat } from '../utils/stackFormat';
import { tableProcessor } from './tableProcessor';

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor = (group, element, context) => {
    if (isBlockElement(element)) {
        // TODO: Use known block processor instead
        generalBlockProcessor(group, element, context);
    } else {
        stackFormat(context, { segment: 'shallowClone' }, () => {
            parseFormat(element, SegmentFormatHandlers, context.segmentFormat, context);
            containerProcessor(group, element, context);
        });
    }
};

const ProcessorMap: Record<string, ElementProcessor> = {
    B: knownElementProcessor,
    BR: brProcessor,
    EM: knownElementProcessor,
    FONT: knownElementProcessor,
    I: knownElementProcessor,
    S: knownElementProcessor,
    STRIKE: knownElementProcessor,
    STRONG: knownElementProcessor,
    SUB: knownElementProcessor,
    SUP: knownElementProcessor,
    TABLE: tableProcessor,
    U: knownElementProcessor,
};

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const singleElementProcessor: ElementProcessor = (group, element, context) => {
    const processor =
        ProcessorMap[element.tagName] ||
        (isBlockElement(element) ? generalBlockProcessor : generalSegmentProcessor);

    processor(group, element, context);
};
