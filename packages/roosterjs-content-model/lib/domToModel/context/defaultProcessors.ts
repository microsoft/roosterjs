import { brProcessor } from '../processors/brProcessor';
import { childProcessor } from '../processors/childProcessor';
import { elementProcessor } from '../processors/elementProcessor';
import { ElementProcessorMap } from '../../publicTypes/context/DomToModelSettings';
import { entityProcessor } from '../processors/entityProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { generalProcessor } from '../processors/generalProcessor';
import { hrProcessor } from '../processors/hrProcessor';
import { imageProcessor } from '../processors/imageProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { listItemProcessor } from '../processors/listItemProcessor';
import { listProcessor } from '../processors/listProcessor';
import { tableProcessor } from '../processors/tableProcessor';
import { textProcessor } from '../processors/textProcessor';

/**
 * @internal
 */
export const defaultProcessorMap: ElementProcessorMap = {
    a: knownElementProcessor,
    b: knownElementProcessor,
    blockquote: knownElementProcessor,
    br: brProcessor,
    center: knownElementProcessor,
    code: knownElementProcessor,
    div: knownElementProcessor,
    em: knownElementProcessor,
    font: fontProcessor,
    i: knownElementProcessor,
    img: imageProcessor,
    h1: knownElementProcessor,
    h2: knownElementProcessor,
    h3: knownElementProcessor,
    h4: knownElementProcessor,
    h5: knownElementProcessor,
    h6: knownElementProcessor,
    hr: hrProcessor,
    li: listItemProcessor,
    ol: listProcessor,
    p: knownElementProcessor,
    pre: knownElementProcessor,
    s: knownElementProcessor,
    span: knownElementProcessor,
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
