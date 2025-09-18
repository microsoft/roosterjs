import type { ReadonlyContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';
import type { CoauthoringUpdateBase } from './ICoauthoringClient';

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
export interface ICoauthoringClientBridge {
    /**
     * True if coauthoring is enabled
     */
    readonly isCoauthoring: boolean;

    /**
     * The owner of this client, should be unique among all clients working on the same page
     */
    readonly owner: string;

    /**
     * Clean up resources held by this client
     */
    dispose(): void;

    /**
     * Handle a local update
     * @param update The update from local client
     */
    onLocalUpdate(update: CoauthoringLocalUpdate): void;
}
