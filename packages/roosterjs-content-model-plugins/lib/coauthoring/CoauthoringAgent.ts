import { cloneModel } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
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

    onUpdate(owner: string, model: ContentModelDocument) {
        for (const client of this.clients) {
            if (client.owner != owner) {
                const targetModel = cloneModel(model, {
                    existingOwner: owner,
                    newOwner: client.owner,
                });

                client.onRemoteUpdate(targetModel);
            }
        }
    }
}
