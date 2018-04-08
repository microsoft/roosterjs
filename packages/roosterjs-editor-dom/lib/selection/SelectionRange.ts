import Position from './Position';

/**
 * Represent a selection range in DOM tree
 */
export default class SelectionRange {
    /**
     * Check if this selection range is collapsed
     */
    readonly collapsed: boolean;

    /**
     * Get the start position
     */
    readonly start: Position;

    /**
     * Get the end position
     */
    readonly end: Position;

    private rawRange: Range;

    /**
     * Create a SelectionRange object using a browser range object
     * @param rawRange The browser range object
     */
    constructor(rawRange: Range);

    /**
     * Create a SelectionRange object using start and end position
     * @param start The start position
     * @param end The end position
     */
    constructor(start: Position, end?: Position);

    constructor(startOrRawRange: Position | Range, end?: Position) {
        if (startOrRawRange instanceof Range) {
            this.rawRange = startOrRawRange;
            this.start = new Position(startOrRawRange.startContainer, startOrRawRange.startOffset);
            this.end = new Position(startOrRawRange.endContainer, startOrRawRange.endOffset);
        } else {
            this.start = startOrRawRange;
            this.end = end || this.start;
        }
        this.collapsed = this.start.node == this.end.node && this.start.offset == this.end.offset;
    }

    /**
     * Retrieve the browser range object
     */
    getRange(): Range {
        if (!this.rawRange) {
            let document = this.start.node.ownerDocument;
            this.rawRange = document.createRange();
            this.rawRange.setStart(this.start.node, this.start.offset);
            this.rawRange.setEnd(this.end.node, this.end.offset);
        }
        return this.rawRange;
    }

    /**
     * Normal this selction range by normalizing its start and end position
     */
    normalize(): SelectionRange {
        return new SelectionRange(this.start.normalize(), this.end.normalize());
    }

    /**
     * Replace this range with a node
     * @param node The node to be inserted
     * @returns True if we complete the replacement, false otherwise
     */
    replaceWithNode(node: Node): boolean {
        // Make sure the range and node is valid
        if (!node) {
            return false;
        }

        let range = this.getRange();
        range.deleteContents();
        range.insertNode(node);

        return true;
    }
}
