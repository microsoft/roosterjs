import { findAllEntities } from './findAllEntities';
import {
    createEntity,
    generateEntityClassList,
    getAllEntityWrappers,
    getObjectKeys,
    isEntityElement,
    parseEntityFormat,
    transformColor,
} from 'roosterjs-content-model-dom';
import {
    handleCompositionEndEvent,
    handleDelimiterContentChangedEvent,
    handleDelimiterKeyDownEvent,
} from './entityDelimiterUtils';
import type {
    ChangedEntity,
    ContentChangedEvent,
    EntityOperation,
    EntityPluginState,
    IEditor,
    MouseUpEvent,
    PluginEvent,
    PluginWithState,
} from 'roosterjs-content-model-types';

const ENTITY_ID_REGEX = /_(\d{1,8})$/;

/**
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
class EntityPlugin implements PluginWithState<EntityPluginState> {
    private editor: IEditor | null = null;
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
        this.editor = editor;
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
                case 'mouseUp':
                    this.handleMouseUpEvent(this.editor, event);
                    break;
                case 'contentChanged':
                    this.handleContentChangedEvent(this.editor, event);
                    break;
                case 'keyDown':
                    handleDelimiterKeyDownEvent(this.editor, event);
                    break;
                case 'compositionEnd':
                    handleCompositionEndEvent(this.editor, event);
                    break;
                case 'editorReady':
                    this.handleContentChangedEvent(this.editor);
                    break;
                case 'extractContentWithDom':
                    this.handleExtractContentWithDomEvent(this.editor, event.clonedRoot);
                    break;
            }
        }
    }

    private handleMouseUpEvent(editor: IEditor, event: MouseUpEvent) {
        const { rawEvent, isClicking } = event;
        let node: Node | null = rawEvent.target as Node;

        if (isClicking && this.editor) {
            while (node && this.editor.getDOMHelper().isNodeInEditor(node)) {
                if (isEntityElement(node)) {
                    this.triggerEvent(editor, node as HTMLElement, 'click', rawEvent);
                    break;
                } else {
                    node = node.parentNode;
                }
            }
        }
    }

    private handleContentChangedEvent(editor: IEditor, event?: ContentChangedEvent) {
        const modifiedEntities: ChangedEntity[] =
            event?.changedEntities ?? this.getChangedEntities(editor);
        const entityStates = event?.entityStates;

        modifiedEntities.forEach(entry => {
            const { entity, operation, rawEvent } = entry;
            const {
                entityFormat: { id, entityType, isFakeEntity },
                wrapper,
            } = entity;

            if (entityType && !isFakeEntity) {
                if (operation == 'newEntity') {
                    entity.entityFormat.id = this.ensureUniqueId(entityType, id ?? '', wrapper);
                    wrapper.classList.add(...generateEntityClassList(entity.entityFormat));

                    if (entity.entityFormat.isReadonly) {
                        wrapper.contentEditable = 'false';
                    }

                    const eventResult = this.triggerEvent(editor, wrapper, operation, rawEvent);

                    this.state.entityMap[entity.entityFormat.id] = {
                        element: wrapper,
                        canPersist: eventResult?.shouldPersist,
                    };

                    if (editor.isDarkMode()) {
                        transformColor(
                            wrapper,
                            true /*includeSelf*/,
                            'lightToDark',
                            editor.getColorManager()
                        );
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

        entityStates?.forEach(entityState => {
            const { id, state } = entityState;
            const wrapper = this.state.entityMap[id]?.element;

            if (wrapper) {
                this.triggerEvent(
                    editor,
                    wrapper,
                    'updateEntityState',
                    undefined /*rawEvent*/,
                    state
                );
            }
        });

        handleDelimiterContentChangedEvent(editor);
    }

    private getChangedEntities(editor: IEditor): ChangedEntity[] {
        const result: ChangedEntity[] = [];

        editor.formatContentModel(model => {
            findAllEntities(model, result);
            return false;
        });

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
                    const format = parseEntityFormat(entry.element);

                    if (!format.isFakeEntity) {
                        const entity = createEntity(
                            entry.element,
                            format.isReadonly,
                            {},
                            format.entityType,
                            format.id
                        );

                        result.push({
                            entity: entity,
                            operation: 'overwrite',
                        });
                    }
                }
            }
        });

        return result;
    }

    private handleExtractContentWithDomEvent(editor: IEditor, root: HTMLElement) {
        getAllEntityWrappers(root).forEach(element => {
            element.removeAttribute('contentEditable');

            this.triggerEvent(editor, element, 'replaceTemporaryContent');
        });
    }

    private triggerEvent(
        editor: IEditor,
        wrapper: HTMLElement,
        operation: EntityOperation,
        rawEvent?: Event,
        state?: string
    ) {
        const format = parseEntityFormat(wrapper);

        return format.id && format.entityType && !format.isFakeEntity
            ? editor.triggerEvent('entityOperation', {
                  operation: operation,
                  rawEvent,
                  entity: {
                      id: format.id,
                      type: format.entityType,
                      isReadonly: !!format.isReadonly,
                      wrapper,
                  },
                  state: operation == 'updateEntityState' ? state : undefined,
                  shouldPersist: operation == 'newEntity' ? true : undefined, // By default, we always persist entity now
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
