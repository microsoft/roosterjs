import {
    inlineEntityOnPluginEvent,
    normalizeDelimitersInEditor,
} from './utils/inlineEntityOnPluginEvent';
import {
    Browser,
    commitEntity,
    getEntityFromElement,
    getEntitySelector,
    isCharacterValue,
    toArray,
    arrayPush,
    createElement,
    addRangeToSelection,
    createRange,
    isBlockElement,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentChangedEvent,
    ContentPosition,
    Entity,
    EntityClasses,
    EntityOperation,
    EntityOperationEvent,
    EntityPluginState,
    ExperimentalFeatures,
    HtmlSanitizerOptions,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginMouseUpEvent,
    PluginWithState,
    QueryScope,
} from 'roosterjs-editor-types';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

const ENTITY_ID_REGEX = /_(\d{1,8})$/;

const ENTITY_CSS_REGEX = '^' + EntityClasses.ENTITY_INFO_NAME + '$';
const ENTITY_ID_CSS_REGEX = '^' + EntityClasses.ENTITY_ID_PREFIX;
const ENTITY_TYPE_CSS_REGEX = '^' + EntityClasses.ENTITY_TYPE_PREFIX;
const ENTITY_READONLY_CSS_REGEX = '^' + EntityClasses.ENTITY_READONLY_PREFIX;
const ALLOWED_CSS_CLASSES = [
    ENTITY_CSS_REGEX,
    ENTITY_ID_CSS_REGEX,
    ENTITY_TYPE_CSS_REGEX,
    ENTITY_READONLY_CSS_REGEX,
];
const REMOVE_ENTITY_OPERATIONS: (EntityOperation | CompatibleEntityOperation)[] = [
    EntityOperation.Overwrite,
    EntityOperation.PartialOverwrite,
    EntityOperation.RemoveFromStart,
    EntityOperation.RemoveFromEnd,
];

/**
 * @internal
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
export default class EntityPlugin implements PluginWithState<EntityPluginState> {
    private editor: IEditor | null = null;
    private state: EntityPluginState;
    private cancelAsyncRun: (() => void) | null = null;

    /**
     * Construct a new instance of EntityPlugin
     */
    constructor() {
        this.state = {
            knownEntityElements: [],
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
        this.state.knownEntityElements = [];
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
        switch (event.eventType) {
            case PluginEventType.MouseUp:
                this.handleMouseUpEvent(event);
                break;
            case PluginEventType.KeyDown:
                this.handleKeyDownEvent(event.rawEvent);
                break;
            case PluginEventType.BeforeCutCopy:
                if (event.isCut) {
                    this.handleCutEvent(event.rawEvent);
                }
                break;
            case PluginEventType.BeforePaste:
                this.handleBeforePasteEvent(event.sanitizingOption);
                break;
            case PluginEventType.ContentChanged:
                this.handleContentChangedEvent(event);
                break;
            case PluginEventType.EditorReady:
                this.handleContentChangedEvent();
                break;
            case PluginEventType.ExtractContentWithDom:
                this.handleExtractContentWithDomEvent(event.clonedRoot);
                break;
            case PluginEventType.ContextMenu:
                this.handleContextMenuEvent(event.rawEvent);
                break;
            case PluginEventType.EntityOperation:
                this.handleEntityOperationEvent(event);
                break;
        }

        if (this.editor?.isFeatureEnabled(ExperimentalFeatures.InlineEntityReadOnlyDelimiters)) {
            inlineEntityOnPluginEvent(event, this.editor);
        }
    }

    private handleContextMenuEvent(event: UIEvent) {
        const node = event.target as Node;
        const entityElement = node && this.editor?.getElementAtCursor(getEntitySelector(), node);

        if (entityElement) {
            event.preventDefault();
            this.triggerEvent(entityElement, EntityOperation.ContextMenu, event);
        }
    }

    private handleCutEvent = (event: ClipboardEvent) => {
        const range = this.editor?.getSelectionRange();
        if (range && !range.collapsed) {
            this.checkRemoveEntityForRange(event);
        }
    };

    private handleMouseUpEvent(event: PluginMouseUpEvent) {
        const { rawEvent, isClicking } = event;
        const node = rawEvent.target as Node;
        let entityElement: HTMLElement | null;

        if (
            this.editor &&
            isClicking &&
            node &&
            !!(entityElement = this.editor.getElementAtCursor(getEntitySelector(), node))
        ) {
            this.triggerEvent(entityElement, EntityOperation.Click, rawEvent);

            workaroundSelectionIssueForIE(this.editor);
        }
    }

    private handleKeyDownEvent(event: KeyboardEvent) {
        if (
            isCharacterValue(event) ||
            event.which == Keys.BACKSPACE ||
            event.which == Keys.DELETE ||
            event.which == Keys.ENTER
        ) {
            const range = this.editor?.getSelectionRange();
            if (range && !range.collapsed) {
                this.checkRemoveEntityForRange(event);
            }
        }
    }

    private handleBeforePasteEvent(sanitizingOption: HtmlSanitizerOptions) {
        const range = this.editor?.getSelectionRange();

        if (range && !range.collapsed) {
            this.checkRemoveEntityForRange(null! /*rawEvent*/);
        }

        if (sanitizingOption.additionalAllowedCssClasses) {
            arrayPush(sanitizingOption.additionalAllowedCssClasses, ALLOWED_CSS_CLASSES);
        }
    }

    private handleContentChangedEvent(event?: ContentChangedEvent) {
        let shouldNormalizeDelimiters: boolean = false;
        // 1. find removed entities
        for (let i = this.state.knownEntityElements.length - 1; i >= 0; i--) {
            const element = this.state.knownEntityElements[i];
            if (this.editor && !this.editor.contains(element)) {
                this.setIsEntityKnown(element, false /*isKnown*/);

                if (
                    !shouldNormalizeDelimiters &&
                    !element.isContentEditable &&
                    !isBlockElement(element)
                ) {
                    shouldNormalizeDelimiters = true;
                }
            }
        }

        // 2. collect all new entities
        const knownIds = this.state.knownEntityElements
            .map(e => getEntityFromElement(e)?.id)
            .filter((x): x is string => !!x);
        const newEntities =
            event?.source == ChangeSource.InsertEntity && event.data
                ? [event.data as Entity]
                : this.getExistingEntities().filter(({ wrapper }) => !this.isEntityKnown(wrapper));

        // 3. Add new entities to known entity list, and hydrate
        newEntities.forEach(entity => {
            const { wrapper, type, id, isReadonly } = entity;

            entity.id = this.ensureUniqueId(type, id, knownIds);
            commitEntity(wrapper, type, isReadonly, entity.id); // Use entity.id here because it is newly updated
            this.handleNewEntity(entity);
        });

        if (
            shouldNormalizeDelimiters &&
            this.editor?.isFeatureEnabled(ExperimentalFeatures.InlineEntityReadOnlyDelimiters)
        ) {
            normalizeDelimitersInEditor(this.editor);
        }
    }

    private handleEntityOperationEvent(event: EntityOperationEvent) {
        if (this.editor && REMOVE_ENTITY_OPERATIONS.indexOf(event.operation) >= 0) {
            this.cancelAsyncRun?.();
            this.cancelAsyncRun = this.editor.runAsync(() => {
                this.cancelAsyncRun = null;
                this.handleContentChangedEvent();
            });
        }
    }

    private handleExtractContentWithDomEvent(root: HTMLElement) {
        toArray(root.querySelectorAll(getEntitySelector())).forEach(element => {
            element.removeAttribute('contentEditable');

            this.triggerEvent(element as HTMLElement, EntityOperation.ReplaceTemporaryContent);
        });
    }

    private checkRemoveEntityForRange(event: Event) {
        const editableEntityElements: HTMLElement[] = [];
        const selector = getEntitySelector();
        this.editor?.queryElements(selector, QueryScope.OnSelection, element => {
            if (element.isContentEditable) {
                editableEntityElements.push(element);
            } else {
                this.triggerEvent(element, EntityOperation.Overwrite, event);
            }
        });

        // For editable entities, we need to check if it is fully or partially covered by current selection,
        // and trigger different events;
        if (this.editor && editableEntityElements.length > 0) {
            const inSelectionEntityElements = this.editor.queryElements(
                selector,
                QueryScope.InSelection
            );
            editableEntityElements.forEach(element => {
                const isFullyCovered = inSelectionEntityElements.indexOf(element) >= 0;
                this.triggerEvent(
                    element,
                    isFullyCovered ? EntityOperation.Overwrite : EntityOperation.PartialOverwrite,
                    event
                );
            });
        }
    }

    private triggerEvent(element: HTMLElement, operation: EntityOperation, rawEvent?: Event) {
        const entity = element && getEntityFromElement(element);

        if (entity) {
            this.editor?.triggerPluginEvent(PluginEventType.EntityOperation, {
                operation,
                rawEvent,
                entity,
            });
        }
    }

    private handleNewEntity(entity: Entity) {
        const { wrapper } = entity;

        this.triggerEvent(wrapper, EntityOperation.NewEntity);
        this.setIsEntityKnown(entity.wrapper, true /*isKnown*/);
    }

    private getExistingEntities(): Entity[] {
        return (
            this.editor
                ?.queryElements(getEntitySelector())
                .map(getEntityFromElement)
                .filter((x): x is Entity => !!x) ?? []
        );
    }

    private ensureUniqueId(type: string, id: string, knownIds: string[]) {
        const match = ENTITY_ID_REGEX.exec(id);
        const baseId = (match ? id.substr(0, id.length - match[0].length) : id) || type;

        // Make sure entity id is unique
        let newId = '';

        for (let num = (match && parseInt(match[1])) || 0; ; num++) {
            newId = num > 0 ? `${baseId}_${num}` : baseId;

            if (knownIds.indexOf(newId) < 0) {
                knownIds.push(newId);
                break;
            }
        }

        return newId;
    }

    private setIsEntityKnown(wrapper: HTMLElement, isKnown: boolean) {
        const index = this.state.knownEntityElements.indexOf(wrapper);
        if (isKnown && index < 0) {
            this.state.knownEntityElements.push(wrapper);
        } else if (!isKnown && index >= 0) {
            this.state.knownEntityElements.splice(index, 1);
        }
    }

    private isEntityKnown(wrapper: HTMLElement) {
        return this.state.knownEntityElements.indexOf(wrapper) >= 0;
    }
}

/**
 * IE will show a resize border around the readonly content within content editable DIV
 * This is a workaround to remove it by temporarily move focus out of editor
 */
const workaroundSelectionIssueForIE = Browser.isIE
    ? (editor: IEditor) => {
          editor.runAsync(editor => {
              const workaroundButton = editor.getCustomData('ENTITY_IE_FOCUS_BUTTON', () => {
                  const button = createElement(
                      {
                          tag: 'button',
                          style: 'overflow:hidden;position:fixed;width:0;height:0;top:-1000px',
                      },
                      editor.getDocument()
                  ) as HTMLElement;
                  button.onblur = () => {
                      button.style.display = 'none';
                  };

                  editor.insertNode(button, {
                      position: ContentPosition.Outside,
                  });

                  return button;
              });

              workaroundButton.style.display = '';
              addRangeToSelection(createRange(workaroundButton, 0));
          });
      }
    : () => {};
