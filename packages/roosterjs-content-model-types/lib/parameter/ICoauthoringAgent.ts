import type { CoauthoringUpdate, ICoauthoringClient } from './ICoauthoringClient';

export interface ICoauthoringAgent {
    register: (client: ICoauthoringClient) => void;
    unregister: (owner: string) => void;
    onClientUpdate: (update: CoauthoringUpdate, owner: string) => void;
}
