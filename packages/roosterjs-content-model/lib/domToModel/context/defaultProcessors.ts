import { brProcessor } from '../processors/brProcessor';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { tableProcessor } from '../processors/tableProcessor';
import { tempContainerProcessor } from '../processors/tempContainerProcessor';

/**
 * @internal
 */
export const defaultProcessorMap: Record<string, ElementProcessor> = {
    B: knownElementProcessor,
    BR: brProcessor,
    DIV: tempContainerProcessor,
    EM: knownElementProcessor,
    FONT: fontProcessor,
    I: knownElementProcessor,
    S: knownElementProcessor,
    SPAN: tempContainerProcessor,
    STRIKE: knownElementProcessor,
    STRONG: knownElementProcessor,
    SUB: knownElementProcessor,
    SUP: knownElementProcessor,
    TABLE: tableProcessor,
    U: knownElementProcessor,
};
