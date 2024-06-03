import { keyboardDelete } from './keyboardDelete';
import { keyboardEnter } from './keyboardEnter';
import { keyboardInput } from './keyboardInput';
import { keyboardTab } from './keyboardTab';
import { parseTableCells } from 'roosterjs-content-model-dom';
import type {
    DOMSelection,
    EditorPlugin,
    IEditor,
    KeyDownEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';

const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;

/**
 * Edit plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Delete Key
 * 2. Backspace Key
 * 3. Tab Key
 */
export class EditPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private shouldHandleNextInputEvent = false;
    private selectionAfterDelete: DOMSelection | null = null;
    private handleEnterKey = false;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Edit';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.handleEnterKey = this.editor.isExperimentalFeatureEnabled('PersistCache');

        if (editor.getEnvironment().isAndroid) {
            this.disposer = this.editor.attachDomEvent({
                beforeinput: {
                    beforeDispatch: e => this.handleBeforeInputEvent(editor, e),
                },
            });
        }
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
        this.disposer?.();
        this.disposer = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case 'keyDown':
                    this.handleKeyDownEvent(this.editor, event);
                    break;
                case 'keyUp':
                    if (this.selectionAfterDelete) {
                        this.editor.setDOMSelection(this.selectionAfterDelete);
                        this.selectionAfterDelete = null;
                    }
                    break;
            }
        }
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check:
     */
    willHandleEventExclusively(event: PluginEvent) {
        if (
            this.editor &&
            event.eventType == 'keyDown' &&
            event.rawEvent.key == 'Tab' &&
            !event.rawEvent.shiftKey
        ) {
            const selection = this.editor.getDOMSelection();
            const startContainer =
                selection?.type == 'range' && selection.range.collapsed
                    ? selection.range.startContainer
                    : null;
            const table = startContainer
                ? this.editor.getDOMHelper().findClosestElementAncestor(startContainer, 'table')
                : null;
            const parsedTable = table && parseTableCells(table);

            if (parsedTable) {
                const lastRow = parsedTable[parsedTable.length - 1];
                const lastCell = lastRow && lastRow[lastRow.length - 1];

                if (typeof lastCell == 'object' && lastCell.contains(startContainer)) {
                    // When TAB in the last cell of a table, we will generate new table row, so prevent other plugins handling this event
                    // e.g. SelectionPlugin will move the focus out of table, which is conflict with this behavior
                    return true;
                }
            }
        }

        return false;
    }

    private handleKeyDownEvent(editor: IEditor, event: KeyDownEvent) {
        const rawEvent = event.rawEvent;

        if (!rawEvent.defaultPrevented && !event.handledByEditFeature) {
            switch (rawEvent.key) {
                case 'Backspace':
                    // Use our API to handle BACKSPACE/DELETE key.
                    // No need to clear cache here since if we rely on browser's behavior, there will be Input event and its handler will reconcile cache
                    keyboardDelete(editor, rawEvent);
                    break;

                case 'Delete':
                    // Use our API to handle BACKSPACE/DELETE key.
                    // No need to clear cache here since if we rely on browser's behavior, there will be Input event and its handler will reconcile cache
                    // And leave it to browser when shift key is pressed so that browser will trigger cut event
                    if (!event.rawEvent.shiftKey) {
                        keyboardDelete(editor, rawEvent);
                    }
                    break;

                case 'Tab':
                    keyboardTab(editor, rawEvent);
                    break;
                case 'Unidentified':
                    if (editor.getEnvironment().isAndroid) {
                        this.shouldHandleNextInputEvent = true;
                    }
                    break;

                case 'Enter':
                    if (this.handleEnterKey) {
                        keyboardEnter(editor, rawEvent);
                    }
                    break;

                default:
                    keyboardInput(editor, rawEvent);
                    break;
            }
        }
    }

    private handleBeforeInputEvent(editor: IEditor, rawEvent: Event) {
        // Some Android IMEs doesn't fire correct keydown event for BACKSPACE/DELETE key
        // Here we translate input event to BACKSPACE/DELETE keydown event to be compatible with existing logic
        if (
            !this.shouldHandleNextInputEvent ||
            !(rawEvent instanceof InputEvent) ||
            rawEvent.defaultPrevented
        ) {
            return;
        }
        this.shouldHandleNextInputEvent = false;

        let handled = false;
        switch (rawEvent.inputType) {
            case 'deleteContentBackward':
                handled = keyboardDelete(
                    editor,
                    new KeyboardEvent('keydown', {
                        key: 'Backspace',
                        keyCode: BACKSPACE_KEY,
                        which: BACKSPACE_KEY,
                    })
                );
                break;
            case 'deleteContentForward':
                handled = keyboardDelete(
                    editor,
                    new KeyboardEvent('keydown', {
                        key: 'Delete',
                        keyCode: DELETE_KEY,
                        which: DELETE_KEY,
                    })
                );
                break;
        }

        if (handled) {
            rawEvent.preventDefault();

            // Restore the selection on keyup event to avoid the cursor jump issue
            // See: https://issues.chromium.org/issues/330596261
            this.selectionAfterDelete = editor.getDOMSelection();
        }
    }
}
