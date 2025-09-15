import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';
import type { ICoauthoringClient } from './ICoauthoringClient';

export interface ICoauthoringAgent {
    register: (client: ICoauthoringClient) => void;
    unregister: (owner: string) => void;
    onUpdate: (owner: string, model: ContentModelDocument) => void;
}
