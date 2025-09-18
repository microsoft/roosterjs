import type { CoauthoringUpdate, ICoauthoringClient } from './ICoauthoringClient';

/**
 * Represents a coauthoring agent which manages multiple coauthoring clients
 */
export interface ICoauthoringAgent {
    /**
     * Register a new coauthoring client
     * @param owner The owner of the client
     * @param client The client to register
     */
    register: (owner: string, client: ICoauthoringClient) => void;

    /**
     * Unregister a coauthoring client
     * @param owner The owner of the client to unregister
     */
    unregister: (owner: string) => void;

    /**
     * Handle a client update
     * @param update The update from the client
     * @param owner The owner of the client
     */
    onClientUpdate: (update: CoauthoringUpdate, owner: string, baseOnVersion: number) => void;
}
