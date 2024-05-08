import type { CacheSelection } from '../pluginState/CachePluginState';
import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';
import type { ReadonlyContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelSegment } from '../contentModel/segment/ContentModelSegment';
import type { ReadonlyContentModelTable } from '../contentModel/block/ContentModelTable';
import type { DOMSelection } from '../selection/DOMSelection';

/**
 * Represents an indexer object which provides methods to help build backward relationship
 * from DOM node to Content Model
 */
export interface DomIndexer {
    /**
     * Invoked when processing a segment
     * @param segmentNode The new DOM node for this segment
     * @param paragraph Parent paragraph of this segment
     * @param segments The source segments
     */
    onSegment: (
        segmentNode: Node,
        paragraph: ReadonlyContentModelParagraph,
        segments: ReadonlyContentModelSegment[]
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
    onTable: (tableElement: HTMLTableElement, tableModel: ReadonlyContentModelTable) => void;

    /**
     * When document content or selection is changed by user, we need to use this function to update the content model
     * to reflect the latest document. This process can fail since the selected node may not have a related model data structure.
     * @param model Current cached content model
     * @param newSelection Latest selection
     * @param oldSelection @optional Original selection before this change
     * @returns True if reconcile successfully, otherwise false
     */
    reconcileSelection: (
        model: ContentModelDocument,
        newSelection: DOMSelection,
        oldSelection?: CacheSelection
    ) => boolean;
}
