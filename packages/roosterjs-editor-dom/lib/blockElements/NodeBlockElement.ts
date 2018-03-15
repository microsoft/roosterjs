import StartEndBlockElement from './StartEndBlockElement';
import InlineElement from '../inlineElements/InlineElement';
import {
    getFirstInlineElement,
    getLastInlineElement,
} from '../inlineElements/getFirstLastInlineElement';

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
            this.firstInline = getFirstInlineElement(this.getStartNode());
        }

        return this.firstInline;
    }

    /**
     * Gets last inline
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            this.lastInline = getLastInlineElement(this.getEndNode());
        }

        return this.lastInline;
    }

    public contains(arg: InlineElement | Node): boolean {
        let node = arg instanceof Node ? arg : arg.getContainerNode();
        return this.getStartNode().contains(node);
    }
}
