import { EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { getEntityFromElement } from 'roosterjs-editor-dom';
import {
    getEntitySelector,
    getObjectKeys,
    isEntityElement,
    toArray,
} from 'roosterjs-content-model-dom';
// import {
//     inlineEntityOnPluginEvent,
//     normalizeDelimitersInEditor,
// } from './utils/inlineEntityOnPluginEvent';
import type {
    ContentModelBlockGroup,
    ContentModelContentChangedEvent,
    ContentModelEntity,
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

/**
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
class EntityPlugin implements PluginWithState<EntityPluginState> {
    private editor: IStandaloneEditor | null = null;
    private state: EntityPluginState;
    private allEntitySelector = getEntitySelector();

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

            //     inlineEntityOnPluginEvent(event);
        }
    }

    private handleMouseUpEvent(editor: IStandaloneEditor, event: PluginMouseUpEvent) {
        const { rawEvent, isClicking } = event;
        let node: Node | null = rawEvent.target as Node;

        if (isClicking) {
            while (node && editor.contains(node)) {
                if (isEntityElement(node)) {
                    this.triggerEvent(editor, node as HTMLElement, EntityOperation.Click, rawEvent);
                    break;
                } else {
                    node = node.parentNode;
                }
            }
        }
    }

    // private handleKeyDownEvent(editor: IStandaloneEditor, event: KeyboardEvent) {
    //     if (isCharacterValue(event) || event.key == 'Enter') {
    //         const selection = editor.getDOMSelection();

    //         if (selection && (selection.type != 'range' || !selection.range.collapsed)) {
    //             editor.formatContentModel((model, context) => {
    //                 const result = deleteSelection(model, [], context).deleteResult;

    //                 return result == 'range' || result == 'singleChar';
    //             });
    //             // this.checkRemoveEntityForRange(editor, event);
    //         }
    //     }
    // }

    private handleContentChangedEvent(editor: IStandaloneEditor, event?: ContentChangedEvent) {
        if ((event as ContentModelContentChangedEvent)?.contentModel) {
            // For event triggered from formatContentModel API (there will be contentModel value in event),
            // no need to check new/deleted entities again since formatContentModel should have already checked.
            return;
        }

        editor.formatContentModel((model, context) => {
            const entitiesInEditor: ContentModelEntity[] = [];
            let result = false;

            findAllEntities(model, entitiesInEditor);

            getObjectKeys(this.state.entityMap).forEach(id => {
                const entry = this.state.entityMap[id];
                const index = entry.isDeleted
                    ? -1
                    : entitiesInEditor.findIndex(
                          x => x.entityFormat.id == id && x.wrapper == entry.element
                      );

                if (index >= 0) {
                    // Found matched entity in editor, so no change, we can safely remove it from the new entity array
                    entitiesInEditor.splice(index, 1);
                } else if (!entry.isDeleted) {
                    // Entity is not in editor, which means it is deleted
                    context.deletedEntities.push({
                        wrapper: entry.element,
                        entityType: entry.type,
                        id: id,
                        operation: 'overwrite',
                    });

                    // Found deleted entity, so need to rewrite to normalize delimiter
                    result = true;
                }
            });

            // Now check the remaining entities in the array and they should be treated as new entities
            entitiesInEditor.forEach(entity => {
                const { id, entityType } = entity.entityFormat;

                if (entityType) {
                    entity.entityFormat.id = this.ensureUniqueId(entityType, id, entity.wrapper);
                    context.newEntities.push(entity);

                    this.state.entityMap[entity.entityFormat.id] = {
                        type: entityType,
                        element: entity.wrapper,
                    };
                }

                // Found new entity, so need to rewrite to normalize delimiter
                result = true;
            });

            // No need to add undo snapshot since we are just normalizing entity delimiter
            context.skipUndoSnapshot = true;

            return result;
        });
    }

    private handleExtractContentWithDomEvent(editor: IStandaloneEditor, root: HTMLElement) {
        toArray(root.querySelectorAll(this.allEntitySelector)).forEach(element => {
            element.removeAttribute('contentEditable');

            this.triggerEvent(
                editor,
                element as HTMLElement,
                EntityOperation.ReplaceTemporaryContent
            );
        });
    }

    // private checkRemoveEntityForRange(editor: IStandaloneEditor, event: Event) {
    //     const editableEntityElements: HTMLElement[] = [];
    //     editor.queryElements(this.allEntitySelector, QueryScope.OnSelection, element => {
    //         if (element.isContentEditable) {
    //             editableEntityElements.push(element);
    //         } else {
    //             this.triggerEvent(editor, element, EntityOperation.Overwrite, event);
    //         }
    //     });

    //     // For editable entities, we need to check if it is fully or partially covered by current selection,
    //     // and trigger different events;
    //     if (editableEntityElements.length > 0) {
    //         const inSelectionEntityElements = editor.queryElements(
    //             this.allEntitySelector,
    //             QueryScope.InSelection
    //         );
    //         editableEntityElements.forEach(element => {
    //             const isFullyCovered = inSelectionEntityElements.indexOf(element) >= 0;
    //             this.triggerEvent(
    //                 editor,
    //                 element,
    //                 isFullyCovered ? EntityOperation.Overwrite : EntityOperation.PartialOverwrite,
    //                 event
    //             );
    //         });
    //     }
    // }

    private triggerEvent(
        editor: IStandaloneEditor,
        element: HTMLElement,
        operation: EntityOperation,
        rawEvent?: Event
    ) {
        const entity = element && getEntityFromElement(element);

        return entity
            ? editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                  operation,
                  rawEvent,
                  entity,
              })
            : null;
    }

    private ensureUniqueId(type: string, id: string | undefined, wrapper: HTMLElement) {
        id = id ?? '';

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

function findAllEntities(group: ContentModelBlockGroup, entities: ContentModelEntity[]) {
    group.blocks.forEach(block => {
        switch (block.blockType) {
            case 'BlockGroup':
                findAllEntities(block, entities);
                break;

            case 'Entity':
                entities.push(block);
                break;

            case 'Paragraph':
                block.segments.forEach(segment => {
                    switch (segment.segmentType) {
                        case 'Entity':
                            tryAddEntityToArray(segment, entities);
                            break;

                        case 'General':
                            findAllEntities(segment, entities);
                            break;
                    }
                });
                break;

            case 'Table':
                block.rows.forEach(row =>
                    row.cells.forEach(cell => findAllEntities(cell, entities))
                );
                break;
        }
    });
}

function tryAddEntityToArray(entity: ContentModelEntity, entities: ContentModelEntity[]) {
    if (!entity.entityFormat.isFakeEntity) {
        entities.push(entity);
    }
}

/**
 * @internal
 * Create a new instance of EntityPlugin.
 */
export function createEntityPlugin(): PluginWithState<EntityPluginState> {
    return new EntityPlugin();
}
