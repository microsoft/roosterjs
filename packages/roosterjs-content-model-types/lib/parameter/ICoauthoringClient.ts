import type { ContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';

/**
 * Type of coauthoring update
 */
export type CoauthoringUpdateType = 'paragraph' | 'model';

/**
 * Base interface for coauthoring update
 */
export interface CoauthoringUpdateBase<T extends CoauthoringUpdateType> {
    /**
     * The type of update
     */
    type: T;
}

/**
 * Coauthoring update for a paragraph
 */
export interface CoauthoringUpdateParagraph extends CoauthoringUpdateBase<'paragraph'> {
    /**
     * The updated paragraph
     */
    paragraphs: ContentModelParagraph[];
}

/**
 * Coauthoring update for the whole model
 */
export interface CoauthoringUpdateModel extends CoauthoringUpdateBase<'model'> {
    /**
     * The updated model
     */
    model: ContentModelDocument;
}

/**
 * Union type of coauthoring update
 */
export type CoauthoringUpdate = CoauthoringUpdateParagraph | CoauthoringUpdateModel;

/**
 * Represents a coauthoring client which can work with other clients through a coauthoring agent
 */
export interface ICoauthoringClient {
    /**
     * Handle a remote update from other clients
     * @param update The update from remote client
     * @param fromOwner The owner of the remote client
     * @param newVersion The new version after applying this update
     */
    onRemoteUpdate(update: CoauthoringUpdate, fromOwner: string, newVersion: number): void;
}
