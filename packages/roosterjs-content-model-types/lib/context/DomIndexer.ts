import type { ContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { CacheSelection } from '../pluginState/CachePluginState';
import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';
import type { ContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ContentModelSegment } from '../contentModel/segment/ContentModelSegment';
import type { ContentModelTable } from '../contentModel/block/ContentModelTable';
import type { DOMSelection } from '../selection/DOMSelection';
import type { ContentModelEntity } from '../contentModel/entity/ContentModelEntity';

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
     * Invoke when new block entity is created in DOM tree
     * @param entity The related entity
     * @param parent Parent of entity. For block element, this should be the parent block group. For inline entity, this should be the parent paragraph
     */
    onBlockEntity: (entity: ContentModelEntity, group: ContentModelBlockGroup) => void;

    /**
     * Invoke when merge two continuous text nodes, we need to merge their indexes as well
     * @param targetText Target text node to merge into
     * @param sourceText Source text node to merge from
     * @example Assume we have two text nodes: Node1="Foo", Node2="Bar", after merge,
     * Node1 will become "FooBar", Node2 will be removed from DOM tree
     */
    onMergeText: (targetText: Text, sourceText: Text) => void;

    /**
     * Clear index from the given container and all its descendants
     * @param container The root container to clear index from
     */
    clearIndex: (container: Node) => void;

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

    /**
     * When id is changed from DOM element, update the new ID to related content model if possible
     * @param element The element that has id changed
     * @returns True if successfully updated, otherwise false
     */
    reconcileElementId: (element: HTMLElement) => boolean;

    /**
     * When child list of editor content is changed, we can use this method to do sync the change from editor into content model.
     * This is mostly used when user start to type in an empty line. In that case browser will remove the existing BR node in the empty line if any,
     * and create a new TEXT node for the typed text. Here we use these information to remove original Br segment and create a new Text segment
     * in content model. But if we find anything that cannot be handled, return false so caller will invalidate the cached model
     * @param addedNodes Nodes added by browser during mutation
     * @param removedNodes Nodes removed by browser during mutation
     * @returns True if the changed nodes are successfully reconciled, otherwise false
     */
    reconcileChildList: (addedNodes: ArrayLike<Node>, removedNodes: ArrayLike<Node>) => boolean;
}
