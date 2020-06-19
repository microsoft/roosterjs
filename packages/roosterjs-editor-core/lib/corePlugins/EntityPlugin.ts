import createEntityClassNames, { getAllEntityIds } from '../entityApi/createEntityClassNames';
import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import getEntityElement from '../entityApi/getEntityElement';
import getEntityFromElement from '../entityApi/getEntityFromElement';
import isCharacterValue from '../eventApi/isCharacterValue';
import tryTriggerEntityEvent from '../entityApi/tryTriggerEntityEvent';
import { Browser, toArray } from 'roosterjs-editor-dom';
import { EntitySelector } from '../entityApi/EntityConstants';
import { Keys } from '../interfaces/ContentEditFeature';
import {
    ContentPosition,
    EntityOperation,
    PluginEvent,
    PluginEventType,
    QueryScope,
    ChangeSource,
} from 'roosterjs-editor-types';
import {
    ClickOnEntityFeature,
    EscapeFromEntityFeature,
    EnterBeforeReadonlyEntityFeature,
    BackspaceAfterEntityFeature,
    DeleteBeforeEntityFeature,
} from './EntityFeatures';

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
                this.handleBeforePasteEvent(event.fragment);
                break;
            case PluginEventType.ContentChanged:
                this.handleContentChangedEvent(event.source == ChangeSource.SetContent);
                break;
            case PluginEventType.EditorReady:
                this.handleContentChangedEvent(true /*resetAll*/);
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

    private handleBeforePasteEvent(fragment: DocumentFragment) {
        const range = this.editor.getSelectionRange();

        if (!range.collapsed) {
            this.checkRemoveEntityForRange(null /*rawEvent*/);
        }

        const entityElements = toArray<HTMLElement>(fragment.querySelectorAll(EntitySelector));
        if (entityElements.length > 0) {
            const knownIds = getAllEntityIds(this.editor);
            entityElements.forEach(element => {
                const entity = getEntityFromElement(element);
                if (entity) {
                    element.className = createEntityClassNames(
                        this.editor,
                        entity.type,
                        entity.isReadonly,
                        entity.id,
                        knownIds
                    );
                }
            });
        }
    }

    private handleContentChangedEvent(resetAll: boolean) {
        this.knownEntityElements = resetAll
            ? []
            : this.knownEntityElements.filter(node => this.editor.contains(node));

        this.editor.queryElements(EntitySelector, element => {
            if (this.knownEntityElements.indexOf(element) < 0) {
                this.knownEntityElements.push(element);

                tryTriggerEntityEvent(
                    this.editor,
                    element,
                    EntityOperation.NewEntity,
                    null /*rawEvent*/
                );
            }
        });
    }

    private checkRemoveEntityForRange(event: UIEvent) {
        this.editor.queryElements(EntitySelector, QueryScope.OnSelection, element => {
            tryTriggerEntityEvent(this.editor, element, EntityOperation.Overwrite, event);
        });
    }
}

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
