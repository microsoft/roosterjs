import isDocumentPosition from '../utils/isDocumentPosition';
import {
    BlockElement,
    DocumentPosition,
    PositionInterface,
    InlineElement,
} from 'roosterjs-editor-types';
import Position from '../selection/Position';
import SelectionRangeBase from '../selection/SelectionRangeBase';

// This is a special version of inline element that identifies a section of an inline element
// We often have the need to cut an inline element in half and perform some operation only on half of an inline element
// i.e. users select only some text of a text node and apply format, in that case, format has to happen on partial of an inline element
// PartialInlineElement is implemented in a way that decorate another full inline element with its own override on methods like isAfter
// It also offers some special methods that others don't have, i.e. nextInlineElement etc.
class PartialInlineElement implements InlineElement {
    constructor(
        private inlineElement: InlineElement,
        private start?: PositionInterface,
        private end?: PositionInterface
    ) {}

    // Get the full inline element that this partial inline decorates
    public getDecoratedInline(): InlineElement {
        return this.inlineElement;
    }

    // Gets the container node
    public getContainerNode(): Node {
        return this.inlineElement.getContainerNode();
    }

    // Gets the parent block
    public getParentBlock(): BlockElement {
        return this.inlineElement.getParentBlock();
    }

    // Gets the text content
    public getTextContent(): string {
        let node = this.inlineElement.getContainerNode();
        return new SelectionRangeBase(
            this.start || new Position(node, Position.Before),
            this.end || new Position(node, Position.After)
        ).toRange().toString();
    }

    // Gets the start position
    public getStartPosition(): PositionInterface {
        return this.start || this.inlineElement.getStartPosition();
    }

    // Gets the end position
    public getEndPosition(): PositionInterface {
        return this.end || this.inlineElement.getEndPosition();
    }

    // Checks if the partial is on start point
    public isStartPartial(): boolean {
        return !!this.start;
    }

    // Checks if the partial is on the end point
    public isEndPartial(): boolean {
        return !!this.end;
    }

    // Get next partial inline element if it is not at the end boundary yet
    public get nextInlineElement(): PartialInlineElement {
        return this.end && new PartialInlineElement(this.inlineElement, this.end, null);
    }

    // Get previous partial inline element if it is not at the begin boundary yet
    public get previousInlineElement(): PartialInlineElement {
        return this.start && new PartialInlineElement(this.inlineElement, null, this.start);
    }

    // Checks if it contains a position
    public contains(p: PositionInterface): boolean {
        return p.isAfter(this.getStartPosition()) && this.getEndPosition().isAfter(p);
    }

    // Check if this inline element is after the other inline element
    public isAfter(inlineElement: InlineElement): boolean {
        // First node level check to see if this element's container node is after (following) the other element (inlineElement)
        // If node level says after (following), it is really "is after"
        let documentPosition: DocumentPosition = inlineElement
            .getContainerNode()
            .compareDocumentPosition(this.getContainerNode());
        let isAfter = isDocumentPosition(documentPosition, DocumentPosition.Following);

        // If node level is not "is after", need to do extra check if the other inline element is also a partial that decorates same inline element
        // and this partical is partial on start (this.startPosition != null)
        // The idea here is to take this partial's start to compare with the other inline end. We consider "is after" only when
        // this partial's start is after or same as the other inline's end
        if (
            !isAfter &&
            documentPosition == DocumentPosition.Same &&
            inlineElement instanceof PartialInlineElement &&
            this.start
        ) {
            // get partial's end
            let otherInline = inlineElement as PartialInlineElement;
            let otherInlineEndPosition = otherInline.getEndPosition();

            // this partial's start
            let thisStartPosition = this.getStartPosition();
            isAfter =
                thisStartPosition.isAfter(otherInlineEndPosition) ||
                thisStartPosition.equalTo(otherInlineEndPosition);
        }

        return isAfter;
    }

    // apply style
    public applyStyle(styler: (node: Node) => void, from?: PositionInterface, to?: PositionInterface): void {
        this.inlineElement.applyStyle(styler, from || this.start, to || this.end);
    }
}

export default PartialInlineElement;
