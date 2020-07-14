import getEntityElement from './getEntityElement';
import getEntityFromElement from './getEntityFromElement';
import tryTriggerEntityEvent from './tryTriggerEntityEvent';
import { Browser, toArray } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin, isCharacterValue, Keys } from 'roosterjs-editor-core';
import {
    getAllEntityIds,
    getEntitySelector,
    serializeEntityInfo,
    ALLOWED_CSS_CLASSES,
} from './EntityInfo';
import {
    ContentPosition,
    EntityOperation,
    PluginEvent,
    PluginEventType,
    QueryScope,
    ChangeSource,
    HtmlSanitizerOptions,
} from 'roosterjs-editor-types';
import {
    ClickOnEntityFeature,
    EscapeFromEntityFeature,
    EnterBeforeReadonlyEntityFeature,
    BackspaceAfterEntityFeature,
    DeleteBeforeEntityFeature,
} from './EntityFeatures';

/**
 * Entity Plugin helps handle all operations related to an entity and generate entity specified events
 */
export default class EntityPlugin implements EditorPlugin {
    private editor: Editor;
    private disposer: () => void;
    private clickingPoint: { pageX: number; pageY: number };
    private knownEntityElements: Node[];

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

        [
            ClickOnEntityFeature,
            EscapeFromEntityFeature,
            EnterBeforeReadonlyEntityFeature,
            BackspaceAfterEntityFeature,
            DeleteBeforeEntityFeature,
        ].forEach(feature => this.editor.addContentEditFeature(feature));
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
        const target = event.target as Node;
        const entityElement = getEntityElement(this.editor, target);

        if (entityElement) {
            event.preventDefault();
            tryTriggerEntityEvent(this.editor, entityElement, EntityOperation.ContextMenu, event);
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
        const entityElement = getEntityElement(this.editor, target as Node);
        if (entityElement && !entityElement.isContentEditable) {
            event.preventDefault();
            this.clickingPoint = { pageX, pageY };
        }
    }

    private handleMouseUpEvent(event: MouseEvent) {
        const { target, pageX, pageY } = event;
        let entityElement: HTMLElement;

        if (
            this.clickingPoint &&
            this.clickingPoint.pageX == pageX &&
            this.clickingPoint.pageY == pageY &&
            !!(entityElement = getEntityElement(this.editor, target as Node))
        ) {
            event.preventDefault();
            tryTriggerEntityEvent(this.editor, entityElement, EntityOperation.Click, event);

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

        const entityElements = toArray<HTMLElement>(fragment.querySelectorAll(getEntitySelector()));
        if (entityElements.length > 0) {
            const knownIds = getAllEntityIds(this.editor);
            entityElements.forEach(element => {
                const entity = getEntityFromElement(element);
                if (entity) {
                    element.className = serializeEntityInfo(
                        this.editor,
                        entity.type,
                        entity.isReadonly,
                        entity.id,
                        knownIds
                    );
                }
            });

            Array.prototype.push.apply(
                sanitizingOption.additionalAllowedCssClasses,
                ALLOWED_CSS_CLASSES
            );
        }
    }

    private handleContentChangedEvent(resetAll: boolean) {
        this.knownEntityElements = resetAll
            ? []
            : this.knownEntityElements.filter(node => this.editor.contains(node));

        this.editor.queryElements(getEntitySelector(), element => {
            if (this.knownEntityElements.indexOf(element) < 0) {
                this.knownEntityElements.push(element);

                tryTriggerEntityEvent(this.editor, element, EntityOperation.NewEntity);
            }
        });
    }

    private handleExtractContentWithDomEvent(root: HTMLElement) {
        toArray(root.querySelectorAll(getEntitySelector())).forEach(element => {
            element.removeAttribute('contentEditable');

            tryTriggerEntityEvent(
                this.editor,
                element as HTMLElement,
                EntityOperation.ReplaceTemporaryContent
            );
        });
    }

    private checkRemoveEntityForRange(event: UIEvent) {
        const editableEntityElements: HTMLElement[] = [];
        const selector = getEntitySelector();
        this.editor.queryElements(selector, QueryScope.OnSelection, element => {
            if (element.isContentEditable) {
                editableEntityElements.push(element);
            } else {
                tryTriggerEntityEvent(this.editor, element, EntityOperation.Overwrite, event);
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
                tryTriggerEntityEvent(
                    this.editor,
                    element,
                    isFullyCovered ? EntityOperation.Overwrite : EntityOperation.PartialOverwrite,
                    event
                );
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
