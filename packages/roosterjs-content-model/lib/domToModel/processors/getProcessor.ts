import { brProcessor } from './brProcessor';
import { ElementProcessor } from './ElementProcessor';
import { tableProcessor } from './tableProcessor';

const ProcessorMap: Record<string, ElementProcessor> = {
    BR: brProcessor,
    TABLE: tableProcessor,
};

/**
 * @internal
 */
export function getProcessor(tagName: string): ElementProcessor {
    return ProcessorMap[tagName];
}
