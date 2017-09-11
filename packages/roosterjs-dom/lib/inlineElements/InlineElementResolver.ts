import InlineElementFactory from './InlineElementFactory';
import { BlockElement, InlineElement } from 'roosterjs-types';

// Resolve a DOM node to an inline element, and return null if it cannot
interface InlineElementResolver {
    resolve: (
        node: Node,
        rootNode: Node,
        parentBlock: BlockElement,
        inlineElementFactory: InlineElementFactory
    ) => InlineElement;
}

export default InlineElementResolver;
