import type { ReadonlyContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';

/**
 * Type of coauthoring update
 */
export type CoauthoringUpdateType = 'paragraph' | 'model';

/**
 * Base interface for coauthoring update
 */
export interface CoauthoringUpdateBase<T extends CoauthoringUpdateType> {
    type: T;
}

/**
 * Coauthoring update for a paragraph
 */
export interface CoauthoringUpdateParagraph extends CoauthoringUpdateBase<'paragraph'> {
    /**
     * The updated paragraph
     */
    paragraph: ReadonlyContentModelParagraph;
}

/**
 * Coauthoring update for the whole model
 */
export interface CoauthoringUpdateModel extends CoauthoringUpdateBase<'model'> {
    /**
     * The updated model
     */
    model: ReadonlyContentModelDocument;
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
     * The owner of this client, should be unique among all clients working on the same page
     */
    readonly owner: string;

    /**
     * True if coauthoring is enabled
     */
    readonly isCoauthoring: boolean;

    /**
     * Clean up resources held by this client
     */
    dispose(): void;

    /**
     * Handle a local update
     * @param update The update from local client
     */
    onLocalUpdate(update: CoauthoringUpdate): void;

    /**
     * Handle a remote update from other clients
     * @param update The update from remote client
     * @param fromOwner The owner of the remote client
     */
    onRemoteUpdate(update: CoauthoringUpdate, fromOwner: string): void;
}
