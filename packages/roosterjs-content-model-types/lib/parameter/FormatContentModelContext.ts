import type { AnnounceData } from './AnnounceData';
import type { ContentModelEntity } from '../contentModel/entity/ContentModelEntity';
import type { ContentModelImage } from '../contentModel/segment/ContentModelImage';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
import type { EntityRemovalOperation } from '../enum/EntityOperation';
import type { ContentModelBlockFormat } from '../contentModel/format/ContentModelBlockFormat';
import type { ParagraphIndexer } from './ParagraphMap';

/**
 * State for an entity. This is used for storing entity undo snapshot
 */
export interface EntityState {
    /**
     * Type of the entity
     */
    type: string;

    /**
     * Id of the entity
     */
    id: string;

    /**
     * The state of this entity to store into undo snapshot.
     * The state can be any string, or a serialized JSON object.
     * We are using string here instead of a JSON object to make sure the whole state is serializable.
     */
    state: string;
}

/**
 * Represents an entity that is deleted by a specified entity operation
 */
export interface DeletedEntity {
    /**
     * The deleted entity
     */
    entity: ContentModelEntity;

    /**
     * The operation that causes this entity to be deleted
     */
    operation: EntityRemovalOperation;
}

/**
 * Context object for API formatWithContentModel
 */
export interface FormatContentModelContext {
    /**
     * New entities added during the format process. This value is only respected when autoDetectChangedEntities is not set to true
     */
    readonly newEntities: ContentModelEntity[];

    /**
     * Entities got deleted during formatting. Need to be set by the formatter function
     * This value is only respected when autoDetectChangedEntities is not set to true
     */
    readonly deletedEntities: DeletedEntity[];

    /**
     * Images inserted in the editor that needs to have their size adjusted
     */
    readonly newImages: ContentModelImage[];

    /**
     * A helper class to help find paragraph from its marker
     */
    readonly paragraphIndexer?: ParagraphIndexer;

    /**
     * Raw Event that triggers this format call
     */
    readonly rawEvent?: Event;

    /**
     * @optional
     * When pass true, skip adding undo snapshot when write Content Model back to DOM.
     * Need to be set by the formatter function
     * Default value is false, which means add undo snapshot
     * When set to true, it will skip adding undo snapshot but mark "hasNewContent" so that next undo snapshot will be added, this is same with "MarkNewContent"
     * When set to 'DoNotSkip', it will add undo snapshot (default behavior)
     * When set to 'MarkNewContent', it will skip adding undo snapshot but mark "hasNewContent" so that next undo snapshot will be added
     * When set to 'SkipAll', it will skip adding undo snapshot and not mark "hasNewContent", as if no change is made
     */
    skipUndoSnapshot?: boolean | 'DoNotSkip' | 'MarkNewContent' | 'SkipAll';

    /**
     * @optional
     * When set to true, formatWithContentModel API will not keep cached Content Model. Next time when we need a Content Model, a new one will be created
     */
    clearModelCache?: boolean;

    /**
     * @optional
     * Specify new pending format.
     * To keep current format event selection position is changed, set this value to "preserved", editor will update pending format position to the new position
     * To set a new pending format, set this property to the format object
     * Otherwise, leave it there and editor will automatically decide if the original pending format is still available
     */
    newPendingFormat?: ContentModelSegmentFormat | 'preserve';

    /**
     * @optional
     * Specify new pending format for paragraph
     * To keep current format event selection position is changed, set this value to "preserved", editor will update pending format position to the new position
     * To set a new pending format, set this property to the format object
     * Otherwise, leave it there and editor will automatically decide if the original pending format is still available
     */
    newPendingParagraphFormat?: ContentModelBlockFormat | 'preserve';

    /**
     * @optional Entity states related to the format API that will be added together with undo snapshot.
     * When entity states are set, each entity state will cause an EntityOperation event with operation = EntityOperation.UpdateEntityState
     * when undo/redo to this snapshot
     */
    entityStates?: EntityState[];

    /**
     * @optional Set to true if this action can be undone when user press Backspace key (aka Auto Complete).
     */
    canUndoByBackspace?: boolean;

    /**
     * @optional Set this value to tell AnnouncePlugin to announce the given information
     */
    announceData?: AnnounceData | null;

    /**
     * @optional When set to true, EntityPlugin will detect any entity changes during this process, newEntities and deletedEntities will be ignored
     */
    autoDetectChangedEntities?: boolean;
}
