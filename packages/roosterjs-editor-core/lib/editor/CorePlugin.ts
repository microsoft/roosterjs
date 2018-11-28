import Editor from './Editor';
import EditorPlugin from './EditorPlugin';
import {
    ChangeSource,
    PluginCompositionEvent,
    PluginEvent,
    PluginEventType,
    PluginMouseUpEvent,
    PositionType,
} from 'roosterjs-editor-types';
import {
    Browser,
    Position,
    getElementOrParentElement,
    applyFormat,
    fromHtml,
    isNodeEmpty,
    getBlockElementAtNode,
} from 'roosterjs-editor-dom';

const KEY_BACKSPACE = 8;

interface AutoCompleteInfo {
    snapshot: string;
    changeSource: string;
}

/**
 * Provides core editing feature for editor:
 * 1. AutoComplete
 * 2. Ensure typing under HTMLElement
 * 3. IME state
 */
export default class CorePlugin implements EditorPlugin {
    public name = 'CorePlugin';
    private editor: Editor;
    private autoCompleteInfo: AutoCompleteInfo;
    private inIME: boolean;
    private disposers: (() => void)[] = null;
    private mouseUpEventListerAdded: boolean;

    /**
     * Creates an instance of Core plugin
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param disableRestoreSelectionOnFocus Whether auto restore previous selection when focus to editor
     */
    constructor(
        private contentDiv: HTMLDivElement,
        private disableRestoreSelectionOnFocus: boolean
    ) {}

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
        this.disposers = [
            this.editor.addDomEventHandler('compositionstart', () => (this.inIME = true)),
            this.editor.addDomEventHandler('compositionend', event => {
                this.inIME = false;
                this.editor.triggerEvent(<PluginCompositionEvent>{
                    eventType: PluginEventType.CompositionEnd,
                    rawEvent: event,
                });
            }),
            this.editor.addDomEventHandler(Browser.isIEOrEdge ? 'beforedeactivate' : 'blur', () =>
                this.editor.saveSelectionRange()
            ),
            this.editor.addDomEventHandler('mousedown', this.onMouseDown),
            this.disableRestoreSelectionOnFocus
                ? null
                : this.editor.addDomEventHandler('focus', () => this.editor.restoreSavedRange()),
        ];
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.removeMouseUpEventListener();

        if (this.disposers) {
            this.disposers.forEach(disposer => disposer && disposer());
            this.disposers = null;
        }

        this.editor = null;
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME() {
        return this.inIME;
    }

    /**
     * Perform an auto complete action in the callback, save a snapsnot of content before the action,
     * and trigger ContentChangedEvent with the change source if specified
     * @param callback The auto complete callback, return value will be used as data field of ContentChangedEvent
     * @param changeSource Chagne source of ContentChangedEvent. If not passed, no ContentChangedEvent will be  triggered
     */
    public performAutoComplete(callback: () => any, changeSource?: ChangeSource) {
        this.editor.addUndoSnapshot((start, end, snapshot) => {
            let data = callback();
            this.autoCompleteInfo = {
                snapshot,
                changeSource,
            };
            return data;
        }, changeSource);
    }

    /**
     * Ensure we are typing in an HTML Element inside editor, and apply default format if current block is empty
     * @param node Current node
     * @returns A new position to select
     */
    public ensureTypeInElement(position: Position): Position {
        position = position.normalize();
        let block = getBlockElementAtNode(this.contentDiv, position.node);
        let formatNode: HTMLElement;

        if (!block) {
            // Only reason we don't get the selection block is that we have an empty content div
            // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
            // The fix is to add a DIV wrapping, apply default format and move cursor over
            let document = this.editor.getDocument();
            formatNode = fromHtml(
                Browser.isEdge ? '<div><span><br></span></div>' : '<div><br></div>',
                document
            )[0] as HTMLElement;
            this.contentDiv.appendChild(formatNode);

            // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
            position = new Position(formatNode.firstChild, PositionType.Begin);
        } else {
            formatNode = block.collapseToSingleElement();

            // if the block is empty, apply default format
            // Otherwise, leave it as it is as we don't want to change the style for existing data
            formatNode = formatNode && isNodeEmpty(formatNode) ? formatNode : null;
        }

        if (formatNode) {
            applyFormat(formatNode, this.editor.getDefaultFormat());
        }

        return position;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.ContentChanged:
                if (this.autoCompleteInfo && this.autoCompleteInfo.changeSource != event.source) {
                    this.onContentChanged();
                }
                break;
            case PluginEventType.MouseDown:
                this.onContentChanged();
                break;
            case PluginEventType.KeyDown:
                this.onContentChanged(event.rawEvent);
                break;
            case PluginEventType.KeyPress:
                this.onKeyPress();
                break;
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
    public willHandleEventExclusively(event: PluginEvent) {
        return (
            this.autoCompleteInfo &&
            event.eventType == PluginEventType.KeyDown &&
            event.rawEvent.which == KEY_BACKSPACE
        );
    }

    private onContentChanged(event?: KeyboardEvent) {
        if (this.autoCompleteInfo) {
            if (event && event.which == KEY_BACKSPACE) {
                event.preventDefault();
                this.editor.setContent(
                    this.autoCompleteInfo.snapshot,
                    false /*triggerContentChangedEvent*/
                );
            }
            this.autoCompleteInfo = null;
        }
    }

    /**
     * Check if user is typing right under the content div
     * When typing goes directly under content div, many things can go wrong
     * We fix it by wrapping it with a div and reposition cursor within the div
     */
    private onKeyPress() {
        let range = this.editor.getSelectionRange();

        if (
            range &&
            range.collapsed &&
            getElementOrParentElement(range.startContainer) == this.contentDiv
        ) {
            let position = this.ensureTypeInElement(Position.getStart(range));
            this.editor.select(position);
        }
    }

    private onMouseDown = () => {
        if (this.editor && !this.mouseUpEventListerAdded) {
            this.editor.getDocument().addEventListener('mouseup', this.onMouseUp, true);
            this.mouseUpEventListerAdded = true;
        }
    };

    private onMouseUp = (event: MouseEvent) => {
        if (this.editor) {
            this.removeMouseUpEventListener();
            this.editor.triggerEvent(<PluginMouseUpEvent>{
                eventType: PluginEventType.MouseUp,
                rawEvent: event,
            });
        }
    };

    private removeMouseUpEventListener() {
        if (this.mouseUpEventListerAdded) {
            this.mouseUpEventListerAdded = false;
            this.editor.getDocument().removeEventListener('mouseup', this.onMouseUp, true);
        }
    }
}
