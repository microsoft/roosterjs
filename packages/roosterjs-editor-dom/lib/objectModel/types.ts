import Position from '../selection/Position';

// This refers to an inline element (as opposed to block) in editor
// Inline and block makes the "type" system in editor.
// An inline element is a maximum resolvable "entity" within the boundary of a block
// At minimum and also most commonly, it represents a text node.
// It can represent broader "content" depending on the resolvers that are available, i.e.
// it can be anchor link, image, emoji, ...
// Two rules:
// 1) every inline element must have a container node (text or span, a etc.)
// 2) inline element cannot be nested
export interface InlineElement {
    // Get the text content of this inline element
    getTextContent: () => string;

    // Get the container node of this inline element
    getContainerNode: () => Node;

    // Get the parent block element of this inline element
    getParentBlock: () => BlockElement;

    // Get the start position of this inline element
    getStartPosition: () => Position;

    // Get the end position of this inline element
    getEndPosition: () => Position;

    // Checks if the given inline element is after this inline element
    isAfter: (inlineElement: InlineElement) => boolean;

    // Checks if the given editor position is contained in this inline element
    contains: (position: Position) => boolean;

    // Apply inline style to a region of an inline element. The region is identified thorugh the from and to point
    // The fromPosition and toPosition are optional and when bing missed, it indicates the boundary of the element
    // The function finds the minimal DOM on top of which styles can be applied, or create DOM when needed, i.e.
    // when the style has to be applied to partial of a text node, in that case, it wraps that in a SPAN and returns the SPAN
    // The actuall styling is done by consumer through the styler callback
    applyStyle: (styler: (node: Node) => void, from?: Position, to?: Position) => void;
}

// This refers to a "content block" in editor that serves as a content parsing boundary
// It is most those html block like tags, i.e. <p>, <div>, <li>, <td> etc.
// but can also be just a text node, followed by a <br>, i.e.
// for html fragment <div>abc<br>123</div>, abc<br> is a block, 123 is another block
export interface BlockElement {
    // Get text content of this block element
    getTextContent: () => string;

    // Get start node of this block element
    getStartNode: () => Node;

    // Get end node of this block element
    getEndNode: () => Node;

    // Get content nodes of this block element as node array
    getContentNodes: () => Node[];

    // Get the first inline element of this block element
    getFirstInlineElement: () => InlineElement;

    // Get the last inline element of this block element
    getLastInlineElement: () => InlineElement;

    // Get all inline elements inside this block element as array
    getInlineElements: () => InlineElement[];

    // Check whether this block element equals to the given block element
    equals: (blockElement: BlockElement) => boolean;

    // Check if the given block is after the this block element
    isAfter: (blockElement: BlockElement) => boolean;

    // Check if the given inline element falls within this block element
    isInBlock: (inlineElement: InlineElement) => boolean;

    // Check if the given node is within this block element
    contains: (node: Node) => boolean;
}
