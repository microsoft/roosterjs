import { brProcessor } from '../processors/brProcessor';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { listItemProcessor } from '../processors/listItemProcessor';
import { listProcessor } from '../processors/listProcessor';
import { quoteProcessor } from '../processors/quoteProcessor';
import { tableProcessor } from '../processors/tableProcessor';
import { tempContainerProcessor } from '../processors/tempContainerProcessor';

/**
 * @internal
 */
export const defaultProcessorMap: Record<string, ElementProcessor> = {
    B: knownElementProcessor,
    BLOCKQUOTE: quoteProcessor,
    BR: brProcessor,
    DIV: tempContainerProcessor,
    EM: knownElementProcessor,
    FONT: fontProcessor,
    I: knownElementProcessor,
    LI: listItemProcessor,
    OL: listProcessor,
    S: knownElementProcessor,
    SPAN: tempContainerProcessor,
    STRIKE: knownElementProcessor,
    STRONG: knownElementProcessor,
    SUB: knownElementProcessor,
    SUP: knownElementProcessor,
    TABLE: tableProcessor,
    U: knownElementProcessor,
    UL: listProcessor,
};
