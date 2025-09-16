import type { ReadonlyContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';

export type CoauthoringUpdateType = 'paragraph' | 'model';
export interface CoauthoringUpdateBase<T extends CoauthoringUpdateType> {
    type: T;
}

export interface CoauthoringUpdateParagraph extends CoauthoringUpdateBase<'paragraph'> {
    paragraph: ReadonlyContentModelParagraph;
}

export interface CoauthoringUpdateModel extends CoauthoringUpdateBase<'model'> {
    model: ReadonlyContentModelDocument;
}

export type CoauthoringUpdate = CoauthoringUpdateParagraph | CoauthoringUpdateModel;

export interface ICoauthoringClient {
    readonly owner: string;
    readonly isCoauthoring: boolean;

    dispose(): void;
    onLocalUpdate(update: CoauthoringUpdate): void;
    onRemoteUpdate(update: CoauthoringUpdate, fromOwner: string): void;
}
