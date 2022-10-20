import { brProcessor } from '../processors/brProcessor';
import { childProcessor } from '../processors/childProcessor';
import { createTempContainerProcessor } from '../processors/tempContainerProcessor';
import { elementProcessor } from '../processors/elementProcessor';
import { ElementProcessorMap } from '../../publicTypes/context/DomToModelSettings';
import { entityProcessor } from '../processors/entityProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { generalProcessor } from '../processors/generalProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { tableProcessor } from '../processors/tableProcessor';
import { textProcessor } from '../processors/textProcessor';

const tempContainerProcessor = createTempContainerProcessor();

/**
 * @internal
 */
export const defaultProcessorMap: ElementProcessorMap = {
    b: knownElementProcessor,
    blockquote: quoteProcessor,
    br: brProcessor,
    div: tempContainerProcessor,
    em: knownElementProcessor,
    font: fontProcessor,
    i: knownElementProcessor,
    li: listItemProcessor,
    ol: listProcessor,
    s: knownElementProcessor,
    span: tempContainerProcessor,
    strike: knownElementProcessor,
    strong: knownElementProcessor,
    sub: knownElementProcessor,
    sup: knownElementProcessor,
    table: tableProcessor,
    u: knownElementProcessor,
    ul: listProcessor,

    '*': generalProcessor,
    '#text': textProcessor,
    element: elementProcessor,
    entity: entityProcessor,
    child: childProcessor,
};
