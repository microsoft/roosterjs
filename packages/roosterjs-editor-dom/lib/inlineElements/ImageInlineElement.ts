import NodeInlineElement from './NodeInlineElement';
import type { BlockElement } from 'roosterjs-editor-types';

/**
 * This is an inline element representing an Html image
 */
export default class ImageInlineElement extends NodeInlineElement {
    constructor(containerNode: Node, parentBlock: BlockElement) {
        super(containerNode, parentBlock);
    }
}
