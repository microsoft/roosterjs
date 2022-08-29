import { brProcessor } from './brProcessor';
import { ElementProcessor } from './ElementProcessor';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';
import { knownSegmentProcessor } from './knownSegmentProcessor';
import { tableProcessor } from './tableProcessor';

// Tag-Processor map
// The value can be a special processor function, or null.
// When set to null, it means this is a known tag and we will use a common processor to handle it
const ProcessorMap: Record<string, ElementProcessor | null> = {
    BR: brProcessor,
    TABLE: tableProcessor,
};

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const singleElementProcessor: ElementProcessor = (group, element, context) => {
    let processor = ProcessorMap[element.tagName];
    const isBlock = isBlockElement(element);

    if (processor === null) {
        processor = isBlock ? generalBlockProcessor : knownSegmentProcessor;
    } else if (!processor) {
        processor = isBlock ? generalBlockProcessor : generalSegmentProcessor;
    }

    processor(group, element, context);
};
