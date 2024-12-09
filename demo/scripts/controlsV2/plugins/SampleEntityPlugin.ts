import { insertEntity } from 'roosterjs-content-model-api';
import type {
    EditorPlugin,
    Entity,
    EntityState,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

const EntityType = 'SampleEntity';

interface EntityMetadata {
    count: number;
}

export default class SampleEntityPlugin implements EditorPlugin {
    private editor: IEditor;
    private hydratedEntities: Record<string, HydratedEntity> = {};

    getName() {
        return 'SampleEntity';
    }

    initialize(editor: IEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        if (event.eventType == 'keyDown' && event.rawEvent.key == 'm' && event.rawEvent.ctrlKey) {
            insertEntity(this.editor, EntityType, true /*isBlock*/, 'focus', {
                contentNode: this.createEntityNode(),
                initialEntityState: '{}',
            });

            event.rawEvent.preventDefault();
        } else if (event.eventType == 'entityOperation' && event.entity.type == EntityType) {
            const entity = event.entity;
            const hydratedEntity = this.hydratedEntities[entity.id];

            switch (event.operation) {
                case 'newEntity':
                    hydratedEntity?.dehydrate();
                    this.hydratedEntities[entity.id] = new HydratedEntity(entity, this.onClick);

                    break;

                case 'removeFromEnd':
                case 'removeFromStart':
                case 'overwrite':
                case 'replaceTemporaryContent':
                    hydratedEntity?.dehydrate();

                    break;

                case 'updateEntityState':
                    if (event.state) {
                        setMetadata(event.entity.wrapper, JSON.parse(event.state));
                        hydratedEntity?.update();
                    }

                    break;

                case 'beforeFormat':
                    const span = entity.wrapper.querySelector('span');

                    if (span && event.formattableRoots) {
                        event.formattableRoots.push({
                            element: span,
                        });
                    }
                    break;
            }
        }
    }

    private onClick = (state: EntityState) => {
        this.editor.takeSnapshot(state);
    };

    private createEntityNode() {
        const div = document.createElement('div');

        return div;
    }
}

class HydratedEntity {
    constructor(private entity: Entity, private onClick: (entityState: EntityState) => void) {
        const containerDiv = entity.wrapper.querySelector('div');
        const span = document.createElement('span');
        const button = document.createElement('button');

        containerDiv.appendChild(span);
        containerDiv.appendChild(button);

        button.textContent = 'Test entity';
        button.addEventListener('click', this.onClickEntity);

        this.update();
    }

    update(increase: number = 0) {
        const metadata = getMetadata<EntityMetadata>(this.entity.wrapper);
        const count = (metadata?.count || 0) + increase;

        setMetadata(this.entity.wrapper, {
            count,
        });

        this.entity.wrapper.querySelector('span').textContent = 'Count: ' + count;
    }

    dehydrate() {
        const containerDiv = this.entity.wrapper.querySelector('div');
        const button = containerDiv.querySelector('button');

        if (button) {
            button.removeEventListener('click', this.onClickEntity);
            containerDiv.removeChild(button);
        }
    }

    private onClickEntity = (e: MouseEvent) => {
        this.update(1);
        this.onClick({
            id: this.entity.id,
            type: this.entity.type,
            state: this.entity.wrapper.dataset.editingInfo,
        });
    };
}

const MetadataDataSetName = 'editingInfo';

function getMetadata<T>(element: HTMLElement): T | null {
    const str = element.dataset[MetadataDataSetName];
    let obj: any;

    try {
        obj = str ? JSON.parse(str) : null;
    } catch {}

    if (typeof obj !== 'undefined') {
        return obj as T;
    } else {
        return null;
    }
}

function setMetadata<T>(element: HTMLElement, metadata: T) {
    element.dataset[MetadataDataSetName] = JSON.stringify(metadata);
}
