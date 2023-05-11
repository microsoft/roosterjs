import { insertEntity } from 'roosterjs-editor-api';
import {
    findClosestElementAncestor,
    getEntityFromElement,
    getEntitySelector,
    getMetadata,
    setMetadata,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    EditorPlugin,
    Entity,
    EntityOperation,
    EntitySnapshot,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

const EntityType = 'SampleEntity';

interface EntityMetadata {
    count: number;
}

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

            this.editor.addUndoSnapshot(() => {
                insertEntity(this.editor, EntityType, entityNode, true, true);
            });
            event.rawEvent.preventDefault();
        } else if (event.eventType == PluginEventType.EntityOperation) {
            switch (event.operation) {
                case EntityOperation.NewEntity:
                    {
                        if (!event.entity.wrapper.querySelector('button')) {
                            const button = document.createElement('button');

                            event.entity.wrapper.appendChild(button);
                            button.textContent = 'Test entity';
                            button.addEventListener('click', this.onClickEntity);
                        }

                        this.updateEntity(event.entity);
                    }
                    break;

                case EntityOperation.RemoveFromEnd:
                case EntityOperation.RemoveFromStart:
                case EntityOperation.Overwrite:
                    {
                        const button = event.entity.wrapper.querySelector('button');
                        button.removeEventListener('click', this.onClickEntity);
                    }
                    break;

                case EntityOperation.ReplaceTemporaryContent:
                    {
                        const button = event.entity.wrapper.querySelector('button');

                        event.entity.wrapper.removeChild(button);
                    }

                    break;
            }
        } else if (
            event.eventType == PluginEventType.ContentChanged &&
            event.source == ChangeSource.UndoEntity
        ) {
            const entitySnapshot = event.data as EntitySnapshot;

            if (entitySnapshot) {
                const wrapper = this.editor.queryElements(
                    getEntitySelector(entitySnapshot.type, entitySnapshot.id)
                )[0];

                if (wrapper) {
                    const entity = getEntityFromElement(wrapper);

                    if (entity) {
                        setMetadata(entity.wrapper, entitySnapshot.stateInfo as EntityMetadata);
                        this.updateEntity(entity);
                    }
                }
            }
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
        const span = document.createElement('span');

        div.appendChild(span);

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
            this.updateEntity(entity, 1);
            this.editor.addUndoSnapshotForEntity(
                entity,
                getMetadata<EntityMetadata>(entity.wrapper)
            );
        }
    };
}
