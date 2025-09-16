import type {
    CoauthoringUpdate,
    ICoauthoringAgent,
    ICoauthoringClient,
} from 'roosterjs-content-model-types';

export class CoauthoringAgent implements ICoauthoringAgent {
    private clients: ICoauthoringClient[] = [];

    register(client: ICoauthoringClient) {
        this.clients.push(client);
    }

    unregister(owner: string) {
        this.clients = this.clients.filter(client => client.owner !== owner);
    }

    onClientUpdate(update: CoauthoringUpdate, owner: string) {
        for (const client of this.clients) {
            if (client.owner != owner) {
                client.onRemoteUpdate(update, owner);
            }
        }
    }
}
