import { insertEntity } from 'roosterjs-editor-api';
import {
    createNumberDefinition,
    createObjectDefinition,
    findClosestElementAncestor,
    getEntityFromElement,
    getEntitySelector,
    getMetadata,
    setMetadata,
} from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    Entity,
    EntityOperation,
    EntityState,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

const EntityType = 'SampleEntity';

interface EntityMetadata {
    count: number;
}

const EntityMetadataDefinition = createObjectDefinition<EntityMetadata>({
    count: createNumberDefinition(),
});

export default class SampleEntityPlugin implements EditorPlugin {
    private editor: IEditor;

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
        if (
            event.eventType == PluginEventType.KeyDown &&
            event.rawEvent.key == 'm' &&
            event.rawEvent.ctrlKey
        ) {
            const entityNode = this.createEntity();
            let entity: Entity | undefined;

            this.editor.addUndoSnapshot(
                () => {
                    entity = insertEntity(this.editor, EntityType, entityNode, true, true);
                },
                undefined /*changeSource*/,
                false /*canUndoByBackspace*/,
                {
                    getEntityState: () => this.getEntityStates(entity),
                }
            );

            event.rawEvent.preventDefault();
        } else if (
            event.eventType == PluginEventType.EntityOperation &&
            event.entity.type == EntityType
        ) {
            switch (event.operation) {
                case EntityOperation.NewEntity:
                    this.dehydrate(event.entity);
                    this.hydrate(event.entity);

                    event.shouldPersist = true;

                    break;

                case EntityOperation.RemoveFromEnd:
                case EntityOperation.RemoveFromStart:
                case EntityOperation.Overwrite:
                case EntityOperation.ReplaceTemporaryContent:
                    this.dehydrate(event.entity);

                    break;

                case EntityOperation.UpdateEntityState:
                    if (event.state) {
                        setMetadata(
                            event.entity.wrapper,
                            JSON.parse(event.state),
                            EntityMetadataDefinition
                        );
                        this.updateEntity(event.entity);
                    }

                    break;
            }
        }
    }

    private hydrate(entity: Entity) {
        const containerDiv = entity.wrapper.querySelector('div');

        const span = document.createElement('span');
        const button = document.createElement('button');

        containerDiv.appendChild(span);
        containerDiv.appendChild(button);

        button.textContent = 'Test entity';
        button.addEventListener('click', this.onClickEntity);

        this.updateEntity(entity);
    }

    private dehydrate(entity: Entity) {
        const containerDiv = entity.wrapper.querySelector('div');
        const button = containerDiv.querySelector('button');

        if (button) {
            button.removeEventListener('click', this.onClickEntity);
            containerDiv.removeChild(button);
        }
    }

    private updateEntity(entity: Entity, increase: number = 0) {
        const metadata = getMetadata<EntityMetadata>(entity.wrapper);
        const count = (metadata?.count || 0) + increase;

        setMetadata(entity.wrapper, {
            count,
        });

        entity.wrapper.querySelector('span').textContent = 'Count: ' + count;
    }

    private createEntity() {
        const div = document.createElement('div');

        return div;
    }

    private onClickEntity = (e: MouseEvent) => {
        const wrapper = findClosestElementAncestor(
            e.target as Node,
            undefined,
            getEntitySelector(EntityType)
        );
        const entity = getEntityFromElement(wrapper);

        if (entity) {
            this.editor.addUndoSnapshot(
                () => {
                    this.updateEntity(entity, 1);
                },
                undefined /*changeSource*/,
                false /*canUndoByBackspace*/,
                {
                    getEntityState: () => this.getEntityStates(entity),
                }
            );
        }
    };

    private getEntityStates(entity: Entity | undefined): EntityState[] {
        return entity
            ? [
                  {
                      id: entity.id,
                      type: entity.type,
                      state: entity.wrapper.dataset.editingInfo,
                  },
              ]
            : undefined;
    }
}
