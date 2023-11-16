import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type { ContentModelImage } from '../segment/ContentModelImage';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { EntityRemovalOperation } from '../enum/EntityOperation';
import type { ContentModelEntityFormat } from '../format/ContentModelEntityFormat';

/**
 * Represents an entity that is deleted by a specified entity operation
 */
export interface DeletedEntity extends ContentModelEntityFormat {
    /**
     * Wrapper element of entity
     */
    wrapper: HTMLElement;

    /**
     * The operation that causes this entity to be deleted
     */
    operation: EntityRemovalOperation;
}

/**
 * Context object for API formatWithContentModel
 */
export interface FormatWithContentModelContext {
    /**
     * New entities added during the format process
     */
    readonly newEntities: ContentModelEntity[];

    /**
     * Entities got deleted during formatting. Need to be set by the formatter function
     */
    readonly deletedEntities: DeletedEntity[];

    /**
     * Images inserted in the editor that needs to have their size adjusted
     */
    readonly newImages: ContentModelImage[];

    /**
     * Raw Event that triggers this format call
     */
    readonly rawEvent?: Event;

    /**
     * @optional
     * When pass true, skip adding undo snapshot when write Content Model back to DOM.
     * Need to be set by the formatter function
     */
    skipUndoSnapshot?: boolean;

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
}
