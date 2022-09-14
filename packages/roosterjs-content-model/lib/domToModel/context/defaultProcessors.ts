import { brProcessor } from '../processors/brProcessor';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { tableProcessor } from '../processors/tableProcessor';

/**
 * @internal
 */
export const defaultProcessorMap: Record<string, ElementProcessor> = {
    B: knownElementProcessor,
    BR: brProcessor,
    EM: knownElementProcessor,
    FONT: fontProcessor,
    I: knownElementProcessor,
    S: knownElementProcessor,
    STRIKE: knownElementProcessor,
    STRONG: knownElementProcessor,
    SUB: knownElementProcessor,
    SUP: knownElementProcessor,
    TABLE: tableProcessor,
    U: knownElementProcessor,
};
