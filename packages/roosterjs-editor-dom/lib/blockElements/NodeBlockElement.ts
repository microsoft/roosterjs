import InlineElement from '../inlineElements/InlineElement';
import StartEndBlockElement from './StartEndBlockElement';
import contains from '../utils/contains';
import getInlineElementAtNode from '../inlineElements/getInlineElementAtNode';
import { getFirstLeafNode, getLastLeafNode } from '../domWalker/getLeafNode';

/**
 * This presents a content block that can be reprented by a single html block type element.
 * In most cases, it corresponds to an HTML block level element, i.e. P, DIV, LI, TD etc.
 */
export default class NodeBlockElement extends StartEndBlockElement {
    /**
     * Create a new instance of NodeBlockElement class
     * @param containerNode The container DOM Node of this NodeBlockElement
     */
    constructor(containerNode: Node) {
        super(containerNode, containerNode);
    }

    /**
     * Gets first inline
     */
    public getFirstInlineElement(): InlineElement {
        if (!this.firstInline) {
            let node = getFirstLeafNode(this.startNode)
            this.firstInline = getInlineElementAtNode(node);
        }

        return this.firstInline;
    }

    /**
     * Gets last inline
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            let node = getLastLeafNode(this.endNode);
            this.lastInline = getInlineElementAtNode(node);
        }

        return this.lastInline;
    }

    public contains(arg: InlineElement | Node): boolean {
        let node = arg instanceof Node ? arg : arg.getContainerNode();
        return contains(this.getStartNode(), node, true /*treatSameNodeAsContain*/);
    }
}
