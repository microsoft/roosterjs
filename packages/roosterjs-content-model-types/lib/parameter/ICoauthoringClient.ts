import type {
    ContentModelParagraph,
    ReadonlyContentModelParagraph,
} from '../contentModel/block/ContentModelParagraph';
import type {
    ContentModelDocument,
    ReadonlyContentModelDocument,
} from '../contentModel/blockGroup/ContentModelDocument';

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
     * Handle a remote update from other clients
     * @param update The update from remote client
     * @param fromOwner The owner of the remote client
     * @param newVersion The new version after applying this update
     * @param originalVersion The original version before applying this update
     */
    onRemoteUpdate(
        update: CoauthoringUpdate,
        fromOwner: string,
        newVersion: number,
        originalVersion: number
    ): void;
}

/**
 * Coauthoring update for a paragraph
 */
export interface CoauthoringLocalUpdateParagraph extends CoauthoringUpdateBase<'paragraph'> {
    /**
     * The updated paragraph
     */
    paragraphs: ReadonlyContentModelParagraph[];
}

/**
 * Coauthoring update for the whole model
 */
export interface CoauthoringLocalUpdateModel extends CoauthoringUpdateBase<'model'> {
    /**
     * The updated model
     */
    model: ReadonlyContentModelDocument;
}

/**
 * Union type of coauthoring update
 */
export type CoauthoringLocalUpdate = CoauthoringLocalUpdateParagraph | CoauthoringLocalUpdateModel;

/**
 * Represents a coauthoring client which can work with other clients through a coauthoring agent
 * and also handle local updates and send them to the agent
 */
export interface ICoauthoringClientBridge extends ICoauthoringClient {
    /**
     * Handle a local update
     * @param update The update from local client
     */
    onLocalUpdate(update: CoauthoringLocalUpdate): void;
}
