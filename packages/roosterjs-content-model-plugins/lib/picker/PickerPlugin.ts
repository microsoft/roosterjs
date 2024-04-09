import { ChangeSource, isCursorMovingKey, isPunctuation } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { getQueryString } from './getQueryString';
import { replaceQueryString } from './replaceQueryString';
import type { IPickerPlugin } from './IPickerPlugin';
import type { PickerDirection, PickerHandler } from './PickerHandler';
import type {
    ContentModelDocument,
    DOMInsertPoint,
    EditorPlugin,
    FormatContentModelOptions,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * PickerPlugin represents a plugin of editor which can handle picker related behaviors, including
 * - Show picker when special trigger key is pressed
 * - Hide picker
 * - Change selection in picker by Up/Down/Left/Right
 * - Apply selected item in picker
 *
 * PickerPlugin doesn't provide any UI, it just wraps related DOM events and invoke callback functions.
 */
export class PickerPlugin<T extends PickerHandler> implements EditorPlugin, IPickerPlugin<T> {
    protected editor: IEditor | null = null;
    private isMac: boolean = false;
    private lastQueryString = '';
    private direction: PickerDirection | null = null;

    /**
     * Construct a new instance of PickerPlugin class
     * @param triggerCharacter The character to trigger a picker to be shown
     * @param handler Picker handler for receiving picker state change events
     */
    constructor(private triggerCharacter: string, public readonly handler: T) {}

    /**
     * Get a friendly name
     */
    getName() {
        return 'Picker';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.isMac = !!this.editor.getEnvironment().isMac;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.direction = null;
    }

    /**
     * Replace the query string with a given Content Model.
     * This is used for commit a change from picker and insert the committed content into editor.
     * @param model The Content Model to insert
     * @param options Options for formatting content model
     * @param canUndoByBackspace Whether this change can be undone using Backspace key
     */
    replaceQueryString(
        model: ContentModelDocument,
        options?: FormatContentModelOptions,
        canUndoByBackspace?: boolean
    ): void {
        if (this.editor) {
            replaceQueryString(
                this.editor,
                this.triggerCharacter,
                model,
                options,
                canUndoByBackspace
            );
        }
    }

    /**
     * Notify Picker Plugin that picker is closed from the handler code, so picker plugin can quit the suggesting state
     */
    closePicker() {
        if (this.direction) {
            this.direction = null;
            this.handler.onClosePicker?.();
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
            !!this.direction && event.eventType == 'keyDown' && isCursorMovingKey(event.rawEvent)
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'contentChanged':
                if (event.source == ChangeSource.SetContent) {
                    this.closePicker();
                } else if (this.direction) {
                    this.onSuggestingInput(this.editor);
                }
                break;

            case 'keyDown':
                if (this.direction) {
                    this.onSuggestingKeyDown(this.editor, this.direction, event.rawEvent);
                }
                break;

            case 'input':
                if (this.direction) {
                    this.onSuggestingInput(this.editor);
                } else {
                    this.onInput(this.editor, event.rawEvent);
                }
                break;

            case 'mouseUp':
                if (this.direction) {
                    this.closePicker();
                }
                break;

            case 'editorReady':
                this.handler.onInitialize(this.editor, this);
                break;

            case 'beforeDispose':
                this.handler.onDispose();
                break;
        }
    }

    private onSuggestingKeyDown(editor: IEditor, direction: PickerDirection, event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                if (direction == 'horizontal' || direction == 'both') {
                    let isIncrement = event.key == 'ArrowRight';

                    if (editor.getDOMHelper().isRightToLeft()) {
                        isIncrement = !isIncrement;
                    }

                    this.handler.onSelectionChanged?.(isIncrement ? 'next' : 'previous');
                }

                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                {
                    const isIncrement = event.key == 'ArrowDown';

                    if (direction != 'horizontal') {
                        this.handler.onSelectionChanged?.(
                            direction == 'both'
                                ? isIncrement
                                    ? 'nextRow'
                                    : 'previousRow'
                                : isIncrement
                                ? 'next'
                                : 'previous'
                        );
                    }
                }

                event.preventDefault();
                break;
            case 'PageUp':
            case 'PageDown':
                this.handler.onSelectionChanged?.(
                    event.key == 'PageDown' ? 'nextPage' : 'previousPage'
                );

                event.preventDefault();
                break;
            case 'Home':
            case 'End':
                const hasCtrl = this.isMac ? event.metaKey : event.ctrlKey;
                this.handler.onSelectionChanged?.(
                    event.key == 'Home'
                        ? hasCtrl
                            ? 'first'
                            : 'firstInRow'
                        : hasCtrl
                        ? 'last'
                        : 'lastInRow'
                );

                event.preventDefault();
                break;
            case 'Escape':
                this.closePicker();
                event.preventDefault();
                break;

            case 'Enter':
            case 'Tab':
                this.handler.onSelect?.();
                event.preventDefault();
                break;
        }
    }

    private onSuggestingInput(editor: IEditor) {
        if (
            !formatTextSegmentBeforeSelectionMarker(editor, (_, segment, paragraph) => {
                const newQueryString = getQueryString(
                    this.triggerCharacter,
                    paragraph,
                    segment
                ).replace(/[\u0020\u00A0]/g, ' ');
                const oldQueryString = this.lastQueryString;

                if (
                    newQueryString &&
                    ((newQueryString.length >= oldQueryString.length &&
                        newQueryString.indexOf(oldQueryString) == 0) ||
                        (newQueryString.length < oldQueryString.length &&
                            oldQueryString.indexOf(newQueryString) == 0))
                ) {
                    this.lastQueryString = newQueryString;
                    this.handler.onQueryStringChanged?.(newQueryString);
                } else {
                    this.closePicker();
                }

                return false;
            })
        ) {
            this.closePicker();
        }
    }

    private onInput(editor: IEditor, event: InputEvent) {
        if (event.inputType == 'insertText' && event.data == this.triggerCharacter) {
            formatTextSegmentBeforeSelectionMarker(editor, (_, segment) => {
                if (segment.text.endsWith(this.triggerCharacter)) {
                    const charBeforeTrigger = segment.text[segment.text.length - 2];

                    if (
                        !charBeforeTrigger ||
                        !charBeforeTrigger.trim() ||
                        isPunctuation(charBeforeTrigger)
                    ) {
                        const selection = editor.getDOMSelection();
                        const pos: DOMInsertPoint | null =
                            selection?.type == 'range' && selection.range.collapsed
                                ? {
                                      node: selection.range.startContainer,
                                      offset: selection.range.startOffset,
                                  }
                                : null;

                        if (pos) {
                            this.lastQueryString = this.triggerCharacter;
                            this.direction = this.handler.onTrigger(this.lastQueryString, pos);
                        }
                    }
                }

                return false;
            });
        }
    }
}
