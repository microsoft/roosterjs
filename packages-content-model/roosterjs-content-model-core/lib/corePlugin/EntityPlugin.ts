import { findAllEntities } from './utils/findAllEntities';
import {
    createEntity,
    generateEntityClassNames,
    getAllEntityWrappers,
    getObjectKeys,
    isEntityElement,
    parseEntityClassName,
} from 'roosterjs-content-model-dom';
import {
    ColorTransformDirection,
    EntityOperation as LegacyEntityOperation,
    PluginEventType,
} from 'roosterjs-editor-types';
import type {
    ChangedEntity,
    ContentModelContentChangedEvent,
    ContentModelEntityFormat,
    EntityOperation,
    EntityPluginState,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';
import type {
    ContentChangedEvent,
    IEditor,
    PluginEvent,
    PluginMouseUpEvent,
    PluginWithState,
} from 'roosterjs-editor-types';

const ENTITY_ID_REGEX = /_(\d{1,8})$/;

// This is only used for compatibility with old editor
// TODO: Remove this map once we have standalone editor
const EntityOperationMap: Record<EntityOperation, LegacyEntityOperation> = {
    newEntity: LegacyEntityOperation.NewEntity,
    overwrite: LegacyEntityOperation.Overwrite,
    removeFromEnd: LegacyEntityOperation.RemoveFromEnd,
    removeFromStart: LegacyEntityOperation.RemoveFromStart,
    replaceTemporaryContent: LegacyEntityOperation.ReplaceTemporaryContent,
    updateEntityState: LegacyEntityOperation.UpdateEntityState,
    click: LegacyEntityOperation.Click,
};

/**
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
class EntityPlugin implements PluginWithState<EntityPluginState> {
    private editor: (IEditor & IStandaloneEditor) | null = null;
    private state: EntityPluginState;

    /**
     * Construct a new instance of EntityPlugin
     */
    constructor() {
        this.state = {
            entityMap: {},
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Entity';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor as IStandaloneEditor & IEditor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.state.entityMap = {};
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.MouseUp:
                    this.handleMouseUpEvent(this.editor, event);
                    break;
                case PluginEventType.ContentChanged:
                    this.handleContentChangedEvent(this.editor, event);
                    break;

                case PluginEventType.EditorReady:
                    this.handleContentChangedEvent(this.editor);
                    break;
                case PluginEventType.ExtractContentWithDom:
                    this.handleExtractContentWithDomEvent(this.editor, event.clonedRoot);
                    break;
            }
        }
    }

    private handleMouseUpEvent(editor: IEditor & IStandaloneEditor, event: PluginMouseUpEvent) {
        const { rawEvent, isClicking } = event;
        let node: Node | null = rawEvent.target as Node;

        if (isClicking && this.editor) {
            while (node && this.editor.contains(node)) {
                if (isEntityElement(node)) {
                    this.triggerEvent(editor, node as HTMLElement, 'click', rawEvent);
                    break;
                } else {
                    node = node.parentNode;
                }
            }
        }
    }

    private handleContentChangedEvent(
        editor: IStandaloneEditor & IEditor,
        event?: ContentChangedEvent
    ) {
        const modifiedEntities: ChangedEntity[] =
            (event as ContentModelContentChangedEvent)?.changedEntities ??
            this.getChangedEntities(editor);

        modifiedEntities.forEach(entry => {
            const { entity, operation, rawEvent } = entry;
            const {
                entityFormat: { id, entityType, isFakeEntity },
                wrapper,
            } = entity;

            if (entityType && !isFakeEntity) {
                if (operation == 'newEntity') {
                    entity.entityFormat.id = this.ensureUniqueId(entityType, id ?? '', wrapper);
                    wrapper.className = generateEntityClassNames(entity.entityFormat);

                    const eventResult = this.triggerEvent(editor, wrapper, operation, rawEvent);

                    this.state.entityMap[entity.entityFormat.id] = {
                        element: wrapper,
                        canPersist: eventResult?.shouldPersist,
                    };

                    if (editor.isDarkMode()) {
                        editor.transformToDarkColor(wrapper, ColorTransformDirection.LightToDark);
                    }
                } else if (id) {
                    const mapEntry = this.state.entityMap[id];

                    if (mapEntry) {
                        mapEntry.isDeleted = true;
                    }

                    this.triggerEvent(editor, wrapper, operation, rawEvent);
                }
            }
        });
    }

    private getChangedEntities(editor: IStandaloneEditor): ChangedEntity[] {
        const result: ChangedEntity[] = [];

        findAllEntities(editor.createContentModel(), result);

        getObjectKeys(this.state.entityMap).forEach(id => {
            const entry = this.state.entityMap[id];

            if (!entry.isDeleted) {
                const index = result.findIndex(
                    x =>
                        x.operation == 'newEntity' &&
                        x.entity.entityFormat.id == id &&
                        x.entity.wrapper == entry.element
                );

                if (index >= 0) {
                    // Found matched entity in editor, so there is no change to this entity,
                    // we can safely remove it from the new entity array
                    result.splice(index, 1);
                } else {
                    // Entity is not in editor, which means it is deleted, use a temporary entity here to represent this entity
                    const tempEntity = createEntity(entry.element);
                    let isEntity = false;

                    entry.element.classList.forEach(name => {
                        isEntity = parseEntityClassName(name, tempEntity.entityFormat) || isEntity;
                    });

                    if (isEntity) {
                        result.push({
                            entity: tempEntity,
                            operation: 'overwrite',
                        });
                    }
                }
            }
        });

        return result;
    }

    private handleExtractContentWithDomEvent(
        editor: IEditor & IStandaloneEditor,
        root: HTMLElement
    ) {
        getAllEntityWrappers(root).forEach(element => {
            element.removeAttribute('contentEditable');

            this.triggerEvent(editor, element, 'replaceTemporaryContent');
        });
    }

    private triggerEvent(
        editor: IEditor & IStandaloneEditor,
        wrapper: HTMLElement,
        operation: EntityOperation,
        rawEvent?: Event
    ) {
        const format: ContentModelEntityFormat = {};
        wrapper.classList.forEach(name => {
            parseEntityClassName(name, format);
        });

        return format.id && format.entityType && !format.isFakeEntity
            ? editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                  operation: EntityOperationMap[operation],
                  rawEvent,
                  entity: {
                      id: format.id,
                      type: format.entityType,
                      isReadonly: !!format.isReadonly,
                      wrapper,
                  },
              })
            : null;
    }

    private ensureUniqueId(type: string, id: string, wrapper: HTMLElement): string {
        const match = ENTITY_ID_REGEX.exec(id);
        const baseId = (match ? id.substr(0, id.length - match[0].length) : id) || type;

        // Make sure entity id is unique
        let newId = '';

        for (let num = (match && parseInt(match[1])) || 0; ; num++) {
            newId = num > 0 ? `${baseId}_${num}` : baseId;

            const item = this.state.entityMap[newId];

            if (!item || item.element == wrapper) {
                break;
            }
        }

        return newId;
    }
}

/**
 * @internal
 * Create a new instance of EntityPlugin.
 */
export function createEntityPlugin(): PluginWithState<EntityPluginState> {
    return new EntityPlugin();
}
