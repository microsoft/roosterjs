import isDocumentPosition from '../utils/isDocumentPosition';
import isEditorPointAfter from '../utils/isEditorPointAfter';
import { BlockElement, DocumentPosition, EditorPoint, InlineElement } from 'roosterjs-editor-types';

// This is a special version of inline element that identifies a section of an inline element
// We often have the need to cut an inline element in half and perform some operation only on half of an inline element
// i.e. users select only some text of a text node and apply format, in that case, format has to happen on partial of an inline element
// PartialInlineElement is implemented in a way that decorate another full inline element with its own override on methods like isAfter
// It also offers some special methods that others don't have, i.e. nextInlineElement etc.
class PartialInlineElement implements InlineElement {
    constructor(
        private inlineElement: InlineElement,
        private startPoint: EditorPoint = null,
        private endPoint: EditorPoint = null
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
        let range = this.getRange();
        return range.toString();
    }

    // Gets the start point
    public getStartPoint(): EditorPoint {
        return this.startPoint ? this.startPoint : this.inlineElement.getStartPoint();
    }

    // Gets the end point
    public getEndPoint(): EditorPoint {
        return this.endPoint ? this.endPoint : this.inlineElement.getEndPoint();
    }

    // Checks if the partial is on start point
    public isStartPartial(): boolean {
        return this.startPoint != null;
    }

    // Checks if the partial is on the end point
    public isEndPartial(): boolean {
        return this.endPoint != null;
    }

    // Get next partial inline element if it is not at the end boundary yet
    public get nextInlineElement(): PartialInlineElement {
        return this.endPoint
            ? new PartialInlineElement(this.inlineElement, this.endPoint, null)
            : null;
    }

    // Get previous partial inline element if it is not at the begin boundary yet
    public get previousInlineElement(): PartialInlineElement {
        return this.startPoint != null
            ? new PartialInlineElement(this.inlineElement, null, this.startPoint)
            : null;
    }

    // Checks if it contains an editor point
    public contains(editorPoint: EditorPoint): boolean {
        return (
            isEditorPointAfter(editorPoint, this.getStartPoint()) &&
            isEditorPointAfter(this.getEndPoint(), editorPoint)
        );
    }

    /**
     * Checks if this inline element is a textual inline element
     */
    public isTextualInlineElement(): boolean {
        return this.inlineElement && this.inlineElement.isTextualInlineElement();
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
        // and this partical is partial on start (this.startPoint != null)
        // The idea here is to take this partial's start to compare with the other inline end. We consider "is after" only when
        // this partial's start is after or same as the other inline's end
        if (
            !isAfter &&
            documentPosition == DocumentPosition.Same &&
            inlineElement instanceof PartialInlineElement &&
            this.startPoint
        ) {
            // get partial's end
            let otherInline = inlineElement as PartialInlineElement;
            let otherInlineEndPoint = otherInline.getEndPoint();

            // this partial's start
            let thisStartPoint = this.getStartPoint();
            isAfter =
                isEditorPointAfter(thisStartPoint, otherInlineEndPoint) ||
                (thisStartPoint.containerNode == otherInlineEndPoint.containerNode &&
                    thisStartPoint.offset == otherInlineEndPoint.offset);
        }

        return isAfter;
    }

    // apply style
    public applyStyle(
        styler: (element: HTMLElement) => any,
        fromPoint?: EditorPoint,
        toPoint?: EditorPoint
    ): void {
        this.inlineElement.applyStyle(
            styler,
            fromPoint ? fromPoint : this.startPoint,
            toPoint ? toPoint : this.endPoint
        );
    }

    // get the entire inline element as a range
    private getRange(): Range {
        let ownerDoc = this.inlineElement.getContainerNode().ownerDocument;
        let range: Range = null;
        if (ownerDoc) {
            range = ownerDoc.createRange();
            if (this.startPoint) {
                range.setStart(this.startPoint.containerNode, this.startPoint.offset);
            } else {
                range.setStartBefore(this.inlineElement.getContainerNode());
            }

            if (this.endPoint) {
                range.setEnd(this.endPoint.containerNode, this.endPoint.offset);
            } else {
                range.setEndAfter(this.inlineElement.getContainerNode());
            }
        }

        return range;
    }
}

export default PartialInlineElement;
