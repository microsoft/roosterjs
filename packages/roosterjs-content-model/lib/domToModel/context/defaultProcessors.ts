import { blockDecoratorProcessor } from '../processors/blockDecoratorProcessor';
import { brProcessor } from '../processors/brProcessor';
import { childProcessor } from '../processors/childProcessor';
import { codeProcessor } from '../processors/codeProcessor';
import { delimiterProcessor } from '../processors/delimiterProcessor';
import { elementProcessor } from '../processors/elementProcessor';
import { ElementProcessorMap } from '../../publicTypes/context/DomToModelSettings';
import { entityProcessor } from '../processors/entityProcessor';
import { fontProcessor } from '../processors/fontProcessor';
import { formatContainerProcessor } from '../processors/formatContainerProcessor';
import { generalProcessor } from '../processors/generalProcessor';
import { hrProcessor } from '../processors/hrProcessor';
import { imageProcessor } from '../processors/imageProcessor';
import { knownElementProcessor } from '../processors/knownElementProcessor';
import { linkProcessor } from '../processors/linkProcessor';
import { listItemProcessor } from '../processors/listItemProcessor';
import { listProcessor } from '../processors/listProcessor';
import { tableProcessor } from '../processors/tableProcessor';
import { textProcessor } from '../processors/textProcessor';

/**
 * @internal
 */
export const defaultProcessorMap: ElementProcessorMap = {
    a: linkProcessor,
    b: knownElementProcessor,
    blockquote: knownElementProcessor,
    br: brProcessor,
    code: codeProcessor,
    div: knownElementProcessor,
    em: knownElementProcessor,
    font: fontProcessor,
    i: knownElementProcessor,
    img: imageProcessor,
    h1: blockDecoratorProcessor,
    h2: blockDecoratorProcessor,
    h3: blockDecoratorProcessor,
    h4: blockDecoratorProcessor,
    h5: blockDecoratorProcessor,
    h6: blockDecoratorProcessor,
    hr: hrProcessor,
    li: listItemProcessor,
    ol: listProcessor,
    p: blockDecoratorProcessor,
    pre: formatContainerProcessor,
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
    delimiter: delimiterProcessor,
};
