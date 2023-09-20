import { ContentModelDocument } from '../group/ContentModelDocument';
import { ContentModelParagraph } from '../block/ContentModelParagraph';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ContentModelTable } from '../block/ContentModelTable';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Represents an indexer object which provides methods to help build backward relationship
 * from DOM node to Content Model
 */
export interface ContentModelDomIndexer {
    /**
     * Invoked when processing a segment
     * @param segmentNode The new DOM node for this segment
     * @param paragraph Parent paragraph of this segment
     * @param segments The source segments
     */
    onSegment: (
        segmentNode: Node,
        paragraph: ContentModelParagraph,
        segments: ContentModelSegment[]
    ) => void;

    /**
     * Invoked when new paragraph node is created in DOM tree
     * @param paragraphElement The new DOM node for this paragraph
     */
    onParagraph: (paragraphElement: HTMLElement) => void;

    /**
     * Invoked when new table node is created in DOM tree
     * @param tableElement The new DOM node for this table
     */
    onTable: (tableElement: HTMLTableElement, tableModel: ContentModelTable) => void;

    /**
     * When document content or selection is changed by user, we need to use this function to update the content model
     * to reflect the latest document. This process can fail since the selected node may not have a related model data structure.
     * @param model Current cached content model
     * @param oldRangeEx Original selection range before this change
     * @param newRangeEx Latest selection range
     * @returns True if reconcile successfully, otherwise false
     */
    reconcileSelection: (
        model: ContentModelDocument,
        oldRangeEx: SelectionRangeEx | undefined,
        newRangeEx: SelectionRangeEx
    ) => boolean;
}
