import createWrapper from '../utils/createWrapper';
import PluginWithState from '../../interfaces/PluginWithState';
import { Editor, isCharacterValue, Keys } from 'roosterjs-editor-core';
import {
    Browser,
    commitEntity,
    getEntityFromElement,
    getEntitySelector,
    toArray,
} from 'roosterjs-editor-dom';
import {
    ContentPosition,
    EntityOperation,
    PluginEvent,
    PluginEventType,
    QueryScope,
    ChangeSource,
    HtmlSanitizerOptions,
    Entity,
    EntityClasses,
    Wrapper,
} from 'roosterjs-editor-types';

const ENTITY_ID_REGEX = /_\d{1,8}$/;

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
 * The state object for EntityPlugin
 */
export interface EntityPluginState {
    /**
     * Last clicking point when mouse down event happens
     */
    clickingPoint: { pageX: number; pageY: number };

    /**
     * All known entity elements
     */
    knownEntityElements: HTMLElement[];
}

/**
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
export default class EntityPlugin implements PluginWithState<EntityPluginState> {
    private editor: Editor;
    private disposer: () => void;
    private state: Wrapper<EntityPluginState>;

    /**
     * Construct a new instance of EntityPlugin
     */
    constructor() {
        this.state = createWrapper({
            clickingPoint: null,
            knownEntityElements: [],
        });
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
    initialize(editor: Editor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler({
            contextmenu: this.handleContextMenuEvent,
            cut: this.handleCutEvent,
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer();
        this.disposer = null;
        this.editor = null;
        this.state.value.knownEntityElements = [];
        this.state.value.clickingPoint = null;
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
        }
    }

    private handleContextMenuEvent = (event: UIEvent) => {
        const node = event.target as Node;
        const entityElement = node && this.editor.getElementAtCursor(getEntitySelector(), node);

        if (entityElement) {
            event.preventDefault();
            this.triggerEvent(entityElement, EntityOperation.ContextMenu, event);
        }
    };

    private handleCutEvent = (event: UIEvent) => {
        const range = this.editor.getSelectionRange();
        if (!range.collapsed) {
            this.checkRemoveEntityForRange(event);
        }
    };

    private handleMouseDownEvent(event: MouseEvent) {
        const { target, pageX, pageY } = event;
        const node = target as Node;
        const entityElement = node && this.editor.getElementAtCursor(getEntitySelector(), node);
        if (entityElement && !entityElement.isContentEditable) {
            event.preventDefault();
            this.state.value.clickingPoint = { pageX, pageY };
        }
    }

    private handleMouseUpEvent(event: MouseEvent) {
        const { target, pageX, pageY } = event;
        const node = target as Node;
        let entityElement: HTMLElement;

        if (
            this.state.value.clickingPoint &&
            this.state.value.clickingPoint.pageX == pageX &&
            this.state.value.clickingPoint.pageY == pageY &&
            node &&
            !!(entityElement = this.editor.getElementAtCursor(getEntitySelector(), node))
        ) {
            event.preventDefault();
            this.triggerEvent(entityElement, EntityOperation.Click, event);

            workaroundSelectionIssueForIE(this.editor);
        }

        this.state.value.clickingPoint = null;
    }

    private handleKeyDownEvent(event: KeyboardEvent) {
        if (
            isCharacterValue(event) ||
            event.which == Keys.BACKSPACE ||
            event.which == Keys.DELETE
        ) {
            const range = this.editor.getSelectionRange();
            if (!range.collapsed) {
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

        Array.prototype.push.apply(
            sanitizingOption.additionalAllowedCssClasses,
            ALLOWED_CSS_CLASSES
        );
    }

    private handleContentChangedEvent(resetAll: boolean) {
        this.state.value.knownEntityElements = resetAll
            ? []
            : this.state.value.knownEntityElements.filter(node => this.editor.contains(node));
        const allId = this.state.value.knownEntityElements
            .map(e => getEntityFromElement(e)?.id)
            .filter(x => !!x);

        this.editor.queryElements(getEntitySelector(), element => {
            if (this.state.value.knownEntityElements.indexOf(element) < 0) {
                this.state.value.knownEntityElements.push(element);

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

    private checkRemoveEntityForRange(event: UIEvent) {
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

    private triggerEvent(element: HTMLElement, operation: EntityOperation, rawEvent?: UIEvent) {
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
    ? (editor: Editor) => {
          editor.runAsync(() => {
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
