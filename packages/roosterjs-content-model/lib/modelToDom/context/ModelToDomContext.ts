import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { Coordinates, NodePosition } from 'roosterjs-editor-types';

/**
 * @internal
 * Represents internal data structure for regular selection
 */
export interface RegularSelection {
    /**
     * Start position of selection
     */
    start?: NodePosition;

    /**
     * End position of selection
     */
    end?: NodePosition;

    /**
     * Current node for Content Model block
     */
    currentBlockNode?: HTMLElement | null;

    /**
     * Current node for Content Model segment
     */
    currentSegmentNode?: Node | null;
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
    regularSelection?: RegularSelection;

    /**
     * Table selection info
     */
    tableSelection?: TableSelection;
}
