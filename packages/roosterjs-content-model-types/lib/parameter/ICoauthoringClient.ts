import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';

export interface ICoauthoringClient {
    readonly owner: string;

    dispose(): void;
    onLocalUpdate(): void;
    onRemoteUpdate(model: ContentModelDocument): void;
}
