import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { Coordinates } from 'roosterjs-editor-types';

/**
 * @internal
 */
export interface RegularSelection {
    /**
     * Is the selection collapsed
     */
    isSelectionCollapsed?: boolean;

    /**
     * Start container of this selection
     */
    startContainer?: Node;

    /**
     * End container of this selection
     */
    endContainer?: Node;

    /**
     * Start offset of this selection
     */
    startOffset?: number;

    /**
     * End offset of this selection
     */
    endOffset?: number;
}

/**
 * @internal
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
export interface ImageSelection {
    /**
     * Selected image
     */
    image: HTMLImageElement;
}

/**
 * @internal
 * Context of DOM to Model conversion, used for parse HTML element according to current context
 */
export interface DomToModelContext {
    /**
     * Is current context under a selection
     */
    isInSelection: boolean;

    /**
     * Common context for ContentModel
     */
    contentModelContext: ContentModelContext;

    /**
     * Regular selection (selection with a highlight background provided by browser)
     */
    regularSelection?: RegularSelection;

    /**
     * Table selection provided by editor
     */
    tableSelection?: TableSelection;

    /**
     * Image selection provided by editor
     */
    imageSelection?: ImageSelection;
}
