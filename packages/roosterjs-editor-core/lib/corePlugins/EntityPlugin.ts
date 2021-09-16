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
    moveChildNodes,
    getComputedStyle,
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
    ShadowEntityCache,
    HtmlSanitizerOptions,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginMouseUpEvent,
    PluginWithState,
    QueryScope,
} from 'roosterjs-editor-types';

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
const REMOVE_ENTITY_OPERATIONS = [
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
    private editor: IEditor;
    private state: EntityPluginState;
    private cancelAsyncRun: () => void;

    /**
     * Construct a new instance of EntityPlugin
     */
    constructor() {
        this.state = {
            knownEntityElements: [],
            shadowEntityCache: {},
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

        // Workaround an issue for Chrome that when Delete or Backsapce, shadow DOM may be lost in editor
        if (Browser.isChrome) {
            this.editor.addContentEditFeature({
                keys: [Keys.BACKSPACE, Keys.DELETE],
                shouldHandleEvent: () => true,
                handleEvent: () => {
                    const cache: Record<string, ShadowEntityCache> = {};
                    this.cacheShadowEntities(cache, wrapper => wrapper.cloneNode(true /*deep*/));
                    this.editor.runAsync(() => {
                        this.getExistingEntities().forEach(entity => {
                            const { wrapper, id } = entity;
                            if (!wrapper.firstChild && cache[id]) {
                                if (cache[id]?.shadowDOM) {
                                    wrapper.appendChild(cache[id].shadowDOM);
                                }
                                this.handleNewEntity(entity);
                            }
                        });
                    });
                },
            });
        }
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check
     */
    willHandleEventExclusively(event: PluginEvent) {
        return (
            event.eventType == PluginEventType.KeyPress &&
            !!(event.rawEvent.target as HTMLElement)?.shadowRoot
        );
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
            case PluginEventType.BeforeSetContent:
                this.handleBeforeSetContentEvent();
                break;
            case PluginEventType.EntityOperation:
                this.handleEntityOperationEvent(event);
                break;
        }
    }

    private handleContextMenuEvent(event: UIEvent) {
        const node = event.target as Node;
        const entityElement = node && this.editor.getElementAtCursor(getEntitySelector(), node);

        if (entityElement) {
            event.preventDefault();
            this.triggerEvent(entityElement, EntityOperation.ContextMenu, event);
        }
    }

    private handleCutEvent = (event: ClipboardEvent) => {
        const range = this.editor.getSelectionRange();
        if (range && !range.collapsed) {
            this.checkRemoveEntityForRange(event);
        }
    };

    private handleMouseUpEvent(event: PluginMouseUpEvent) {
        const { rawEvent, isClicking } = event;
        const node = rawEvent.target as Node;
        let entityElement: HTMLElement;

        if (
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
            const range = this.editor.getSelectionRange();
            if (range && !range.collapsed) {
                this.checkRemoveEntityForRange(event);
            }
        }
    }

    private handleBeforePasteEvent(sanitizingOption: HtmlSanitizerOptions) {
        const range = this.editor.getSelectionRange();

        if (!range.collapsed) {
            this.checkRemoveEntityForRange(null /*rawEvent*/);
        }

        arrayPush(sanitizingOption.additionalAllowedCssClasses, ALLOWED_CSS_CLASSES);
    }

    private handleBeforeSetContentEvent() {
        this.cacheShadowEntities(this.state.shadowEntityCache, wrapper => wrapper.shadowRoot);
    }

    private handleContentChangedEvent(event?: ContentChangedEvent) {
        // 1. find potentially removed entity, and remove from known entity list
        const potentialRemovedShadowEntity: HTMLElement[] = [];

        for (let i = this.state.knownEntityElements.length - 1; i >= 0; i--) {
            const element = this.state.knownEntityElements[i];
            if (!this.editor.contains(element)) {
                this.state.knownEntityElements.splice(i, 1);

                if (element.shadowRoot) {
                    potentialRemovedShadowEntity.push(element);
                }
            }
        }

        // 2. collect all new entities
        const knownIds = this.state.knownEntityElements
            .map(e => getEntityFromElement(e)?.id)
            .filter(x => !!x);
        const newEntities =
            event?.source == ChangeSource.InsertEntity && event.data
                ? [event.data as Entity]
                : this.getExistingEntities().filter(
                      ({ wrapper }) => this.state.knownEntityElements.indexOf(wrapper) < 0
                  );

        // 3. Add new entities to known entity list, and hydrate
        newEntities.forEach(entity => {
            const { wrapper, type, id, isReadonly } = entity;

            entity.id = this.ensureUniqueId(type, id, knownIds);
            commitEntity(wrapper, type, isReadonly, entity.id); // Use entity.id here because it is newly updated
            this.handleNewEntity(entity);
        });

        this.state.shadowEntityCache = {};

        // 4. Check those potentially removed entities, if really removed, fire RemoveShadowEntity event
        potentialRemovedShadowEntity.forEach(element => {
            const entity = getEntityFromElement(element);
            if (!entity || knownIds.indexOf(entity.id) < 0) {
                this.triggerEvent(element, EntityOperation.RemoveShadowRoot);
            }
        });
    }

    private handleEntityOperationEvent(event: EntityOperationEvent) {
        if (REMOVE_ENTITY_OPERATIONS.indexOf(event.operation) >= 0) {
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
        this.editor.queryElements(selector, QueryScope.OnSelection, element => {
            if (element.isContentEditable) {
                editableEntityElements.push(element);
            } else {
                this.triggerEvent(element, EntityOperation.Overwrite, event);
            }
        });

        // For editable entities, we need to check if it is fully or partially covered by current selection,
        // and trigger different events;
        if (editableEntityElements.length > 0) {
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

    private triggerEvent(
        element: HTMLElement,
        operation: EntityOperation,
        rawEvent?: Event,
        contentForShadowEntity?: DocumentFragment
    ) {
        const entity = element && getEntityFromElement(element);

        if (entity) {
            return this.editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                operation,
                rawEvent,
                entity,
                contentForShadowEntity,
            });
        } else {
            return null;
        }
    }

    private handleNewEntity(entity: Entity) {
        const { wrapper } = entity;

        // 1. Trigger NewEntity event and get elements to hydrate.
        // If any existing element from shadow entity cache is not about to hydrate to entity shadow root,
        // trigger RemoveShadowRoot event
        const cacheItem = this.state.shadowEntityCache[entity.id];
        const cache = cacheItem?.shadowDOM || wrapper.ownerDocument.createDocumentFragment();
        const originalElements = toArray(cache.childNodes);

        this.triggerEvent(wrapper, EntityOperation.NewEntity, undefined /*rawEvent*/, cache);

        const newElements = toArray(cache.childNodes);

        if (cacheItem?.wrapper && originalElements.some(e => newElements.indexOf(e) < 0)) {
            this.triggerEvent(cacheItem.wrapper, EntityOperation.RemoveShadowRoot);
        }

        // 2. If there is element to hydrate for shadow entity, craete shadow root and mount these elements to shadow root
        // Then trigger AddShadowRoot so that plugins can do further actions
        if (cache.firstChild) {
            wrapper.contentEditable = 'false';
            wrapper.dir = getComputedStyle(wrapper, 'direction');

            const shadowRoot =
                wrapper.shadowRoot ||
                wrapper.attachShadow({
                    mode: 'open',
                    delegatesFocus: true,
                });

            // Use moveChildNodes instead of appendChild, so that we remove existing child nodes under shadow root if any
            moveChildNodes(shadowRoot, cache);

            this.triggerEvent(wrapper, EntityOperation.AddShadowRoot);
        } else if (wrapper.shadowRoot) {
            // If no elements to hydrate, remove existing shadow root by cloning a new node
            const newWrapper = wrapper.cloneNode(true /*deep*/) as HTMLElement;
            this.editor.replaceNode(wrapper, newWrapper);
            entity.wrapper = newWrapper;
        }

        this.state.knownEntityElements.push(entity.wrapper);
    }

    private getExistingEntities(shadowEntityOnly?: boolean): Entity[] {
        return this.editor
            .queryElements(getEntitySelector())
            .map(getEntityFromElement)
            .filter(x => !!x && (!shadowEntityOnly || !!x.wrapper.shadowRoot));
    }

    private cacheShadowEntities(
        cache: Record<string, ShadowEntityCache>,
        cacheMethod: (wrapper: HTMLElement) => Node
    ) {
        const doc = this.editor.getDocument();
        this.getExistingEntities(true /*shadowEntityOnly*/).forEach(({ wrapper, id }) => {
            const fragment = doc.createDocumentFragment();
            moveChildNodes(fragment, cacheMethod(wrapper));
            cache[id] = {
                wrapper,
                shadowDOM: fragment,
            };
        });
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
