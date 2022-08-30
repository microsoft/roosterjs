import { brProcessor } from './brProcessor';
import { containerProcessor } from './containerProcessor';
import { ElementProcessor } from './ElementProcessor';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';
import { parseFormat } from '../utils/parseFormat';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';
import { stackSegmentFormat } from '../utils/stackSegmentFormat';
import { tableProcessor } from './tableProcessor';

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor = (group, element, context) => {
    if (isBlockElement(element)) {
        // TODO: Use known block processor instead
        generalBlockProcessor(group, element, context);
    } else {
        stackSegmentFormat(context, () => {
            parseFormat(
                element,
                SegmentFormatHandlers,
                context.segmentFormat,
                context.contentModelContext
            );
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
