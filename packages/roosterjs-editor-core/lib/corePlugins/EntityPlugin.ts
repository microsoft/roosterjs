import {
    Browser,
    commitEntity,
    getEntityFromElement,
    getEntitySelector,
    isCharacterValue,
    toArray,
    arrayPush,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    Entity,
    EntityClasses,
    EntityOperation,
    EntityPluginState,
    HtmlSanitizerOptions,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
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

/**
 * @internal
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
export default class EntityPlugin implements PluginWithState<EntityPluginState> {
    private editor: IEditor;
    private state: EntityPluginState;

    /**
     * Construct a new instance of EntityPlugin
     */
    constructor() {
        this.state = {
            clickingPoint: null,
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
        this.state.clickingPoint = null;
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
            case PluginEventType.MouseDown:
                this.handleMouseDownEvent(event.rawEvent);
                break;
            case PluginEventType.MouseUp:
                this.handleMouseUpEvent(event.rawEvent);
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
                this.handleBeforePasteEvent(event.fragment, event.sanitizingOption);
                break;
            case PluginEventType.ContentChanged:
                this.handleContentChangedEvent(event.source == ChangeSource.SetContent);
                break;
            case PluginEventType.EditorReady:
                this.handleContentChangedEvent(true /*resetAll*/);
                break;
            case PluginEventType.ExtractContentWithDom:
                this.handleExtractContentWithDomEvent(event.clonedRoot);
                break;
            case PluginEventType.ContextMenu:
                this.handleContextMenuEvent(event.rawEvent);
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

    private handleMouseDownEvent(event: MouseEvent) {
        const { target, pageX, pageY } = event;
        const node = target as Node;
        const entityElement = node && this.editor.getElementAtCursor(getEntitySelector(), node);
        if (entityElement && !entityElement.isContentEditable) {
            event.preventDefault();
            this.state.clickingPoint = { pageX, pageY };
        }
    }

    private handleMouseUpEvent(event: MouseEvent) {
        const { target, pageX, pageY } = event;
        const node = target as Node;
        let entityElement: HTMLElement;

        if (
            this.state.clickingPoint &&
            this.state.clickingPoint.pageX == pageX &&
            this.state.clickingPoint.pageY == pageY &&
            node &&
            !!(entityElement = this.editor.getElementAtCursor(getEntitySelector(), node))
        ) {
            event.preventDefault();
            this.triggerEvent(entityElement, EntityOperation.Click, event);

            workaroundSelectionIssueForIE(this.editor);
        }

        this.state.clickingPoint = null;
    }

    private handleKeyDownEvent(event: KeyboardEvent) {
        if (
            isCharacterValue(event) ||
            event.which == Keys.BACKSPACE ||
            event.which == Keys.DELETE
        ) {
            const range = this.editor.getSelectionRange();
            if (range && !range.collapsed) {
                this.checkRemoveEntityForRange(event);
            }
        }
    }

    private handleBeforePasteEvent(
        fragment: DocumentFragment,
        sanitizingOption: HtmlSanitizerOptions
    ) {
        const range = this.editor.getSelectionRange();

        if (!range.collapsed) {
            this.checkRemoveEntityForRange(null /*rawEvent*/);
        }

        arrayPush(sanitizingOption.additionalAllowedCssClasses, ALLOWED_CSS_CLASSES);
    }

    private handleContentChangedEvent(resetAll: boolean) {
        this.state.knownEntityElements = resetAll
            ? []
            : this.state.knownEntityElements.filter(node => this.editor.contains(node));
        const allId = this.state.knownEntityElements
            .map(e => getEntityFromElement(e)?.id)
            .filter(x => !!x);

        this.editor.queryElements(getEntitySelector(), element => {
            if (this.state.knownEntityElements.indexOf(element) < 0) {
                this.state.knownEntityElements.push(element);

                const entity = getEntityFromElement(element);

                this.hydrateEntity(entity, allId);
            }
        });
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

    private hydrateEntity(entity: Entity, knownIds: string[]) {
        const { id, type, wrapper, isReadonly } = entity;
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

        commitEntity(wrapper, type, isReadonly, newId);

        this.triggerEvent(wrapper, EntityOperation.NewEntity);
    }

    private triggerEvent(element: HTMLElement, operation: EntityOperation, rawEvent?: Event) {
        const entity = element && getEntityFromElement(element);

        if (entity) {
            this.editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                operation,
                rawEvent,
                entity,
            });
        }
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
                  const button = editor.getDocument().createElement('button');
                  button.style.overflow = 'hidden';
                  button.style.position = 'fixed';
                  button.style.width = '0';
                  button.style.height = '0';
                  button.style.left = '0';
                  button.style.top = '-1000px';
                  button.onblur = () => {
                      button.style.display = 'none';
                  };

                  editor.insertNode(button, {
                      position: ContentPosition.Outside,
                  });

                  return button;
              });

              workaroundButton.style.display = '';
              const range = editor.getDocument().createRange();
              range.setStart(workaroundButton, 0);
              try {
                  window.getSelection().removeAllRanges();
                  window.getSelection().addRange(range);
              } catch {}
          });
      }
    : () => {};
