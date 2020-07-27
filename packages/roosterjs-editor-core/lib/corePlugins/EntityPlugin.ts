import { Editor, EditorPlugin, isCharacterValue, Keys } from 'roosterjs-editor-core';
import {
    Browser,
    createEntityWrapper,
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
} from 'roosterjs-editor-types';

const ENTITY_ID_REGEX = /_\d{1,8}$/;

const ENTITY_CSS_REGEX = '^' + EntityClasses.ENTITY_INFO_NAME + '$';
const ENTITY_ID_CSS_REGEX = '^' + EntityClasses.ENTITY_ID_PREFIX;
const ENTITY_TYPE_CSS_REGEX = '^' + EntityClasses.ENTITY_TYPE_PREFIX;
const ENTITY_READONLY_CSS_REGEX = '^' + EntityClasses.ENTITY_READONLY_PREFIX;

export const ALLOWED_CSS_CLASSES = [
    ENTITY_CSS_REGEX,
    ENTITY_ID_CSS_REGEX,
    ENTITY_TYPE_CSS_REGEX,
    ENTITY_READONLY_CSS_REGEX,
];

/**
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
export default class EntityPlugin implements EditorPlugin {
    private editor: Editor;
    private disposer: () => void;
    private clickingPoint: { pageX: number; pageY: number };
    private knownEntityElements: HTMLElement[];

    getName() {
        return 'Entity';
    }

    initialize(editor: Editor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler({
            contextmenu: this.handleContextMenuEvent,
            cut: this.handleCutEvent,
        });

        this.knownEntityElements = [];
    }

    dispose() {
        this.disposer();
        this.disposer = null;
        this.editor = null;
        this.knownEntityElements = null;
    }

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
            this.clickingPoint = { pageX, pageY };
        }
    }

    private handleMouseUpEvent(event: MouseEvent) {
        const { target, pageX, pageY } = event;
        const node = target as Node;
        let entityElement: HTMLElement;

        if (
            this.clickingPoint &&
            this.clickingPoint.pageX == pageX &&
            this.clickingPoint.pageY == pageY &&
            node &&
            !!(entityElement = this.editor.getElementAtCursor(getEntitySelector(), node))
        ) {
            event.preventDefault();
            this.triggerEvent(entityElement, EntityOperation.Click, event);

            workaroundSelectionIssueForIE(this.editor);
        }

        this.clickingPoint = null;
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
        this.knownEntityElements = resetAll
            ? []
            : this.knownEntityElements.filter(node => this.editor.contains(node));
        const allId = this.knownEntityElements
            .map(e => getEntityFromElement(e)?.id)
            .filter(x => !!x);

        this.editor.queryElements(getEntitySelector(), element => {
            if (this.knownEntityElements.indexOf(element) < 0) {
                this.knownEntityElements.push(element);

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
        const { id, type, isReadonly, contentNode } = entity;
        const match = ENTITY_ID_REGEX.exec(id);
        const baseId = (match ? id.substr(0, id.length - match[0].length) : id) || type;
        let newId = '';

        for (let num = (match && parseInt(match[1])) || 0; ; num++) {
            newId = num > 0 ? `${baseId}_${num}` : baseId;

            if (knownIds.indexOf(newId) < 0) {
                knownIds.push(newId);
                break;
            }
        }

        if (newId != entity.id) {
            entity.id = newId;
            createEntityWrapper(contentNode, type, isReadonly, newId);
        }

        if (isReadonly) {
            contentNode.contentEditable = 'false';
        }

        this.triggerEvent(contentNode, EntityOperation.NewEntity);
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
