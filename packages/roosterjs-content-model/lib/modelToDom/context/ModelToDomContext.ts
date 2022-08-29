import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { Coordinates } from 'roosterjs-editor-types';

/**
 * @internal
 * Represents internal data structure for a selection position, combined by block and segment node
 */
export interface BlockAndSegmentNode {
    /**
     * The block element of the selection. When segment is null, it represents the start position of this block element,
     * otherwise block element will be ignored and we can always retrieve position from segment node
     */
    block: HTMLElement | null;

    /**
     * Segment node of this position. When provided, it represents the position right after this node
     */
    segment: Node | null;
}

/**
 * @internal
 * Represents internal data structure for regular selection
 */
export interface RegularSelection {
    /**
     * Start position of selection
     */
    start?: BlockAndSegmentNode;

    /**
     * End position of selection
     */
    end?: BlockAndSegmentNode;

    /**
     * Current navigating position
     */
    current: BlockAndSegmentNode;
}

/**
 * @internal
 * Represents internal data structure for table selection
 */
export interface TableSelection {
    /**
     * Table where selection is located
     */
    table: HTMLTableElement;

    /**
     * Coordinate of first selected cell
     */
    firstCell: Coordinates;

    /**
     * Coordinate of last selected cell
     */
    lastCell: Coordinates;
}

/**
 * @internal
 */
export interface ModelToDomContext {
    /**
     * Common context for ContentModel
     */
    readonly contentModelContext: ContentModelContext;

    /**
     * Regular selection info
     */
    regularSelection: RegularSelection;

    /**
     * Table selection info
     */
    tableSelection?: TableSelection;
}
