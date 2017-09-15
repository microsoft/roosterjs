import {
    setIndentation,
    cacheGetCursorEventData,
    cacheGetListElement,
    cacheGetListState,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';
import { Editor, EditorPlugin, browserData } from 'roosterjs-editor-core';
import {
    Indentation,
    ListState,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

const KEY_TAB = 9;
const KEY_BACKSPACE = 8;
const KEY_ENTER = 13;

// An editor plugin to auto increase/decrease indentation on Tab, Shift+tab, Enter, Backspace
export default class TabIndent implements EditorPlugin {
    private editor: Editor;

    // onlyBegin: To instruct auto indent to happen only when cursor is at begin of a list
    constructor(private onlyBegin: boolean = false) {}

    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    public dispose(): void {
        this.editor = null;
    }

    // Handle the event if it is a tab event, and cursor is at begin of a list
    public willHandleEventExclusively(event: PluginEvent): boolean {
        let shouldHandleEventExclusively = false;

        if (this.isListEvent(event, [KEY_TAB])) {
            // Checks if cursor at begin of a block
            if (this.onlyBegin) {
                // When CursorData.inlineBeforeCursor == null, there isn't anything before cursor, we consider
                // cursor is at begin of a list
                let cursorData = cacheGetCursorEventData(event, this.editor);
                shouldHandleEventExclusively = cursorData && !cursorData.inlineElementBeforeCursor;
            } else {
                shouldHandleEventExclusively = true;
            }
        }

        return shouldHandleEventExclusively;
    }

    // Handle the event
    public onPluginEvent(event: PluginEvent): void {
        if (this.isListEvent(event, [KEY_TAB, KEY_BACKSPACE, KEY_ENTER])) {
            // Tab: increase indent
            // Shift+ Tab: decrease indent
            let keybordEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
            if (keybordEvent.which == KEY_TAB) {
                setIndentation(
                    this.editor,
                    keybordEvent.shiftKey ? Indentation.Decrease : Indentation.Increase
                );
                keybordEvent.preventDefault();
            } else if (browserData.isEdge || browserData.isIE || browserData.isChrome) {
                let listElement = cacheGetListElement(this.editor, event);
                if (
                    listElement &&
                    listElement.textContent == '' &&
                    (keybordEvent.which == KEY_ENTER ||
                        (keybordEvent.which == KEY_BACKSPACE &&
                            listElement == listElement.parentElement.firstChild))
                ) {
                    keybordEvent.preventDefault();
                    let listState = cacheGetListState(this.editor, event);
                    if (listState == ListState.Bullets) {
                        toggleBullet(this.editor);
                    } else if (listState == ListState.Numbering) {
                        toggleNumbering(this.editor);
                    }
                }
            }
        }
    }

    // Check if it is a tab or shift+tab / Enter / Backspace event
    // This tests following:
    // 1) is keydown
    // 2) is Tab / Enter / Backspace
    // 3) any of ctrl/meta/alt is not pressed
    private isListEvent(event: PluginEvent, interestedKeyCodes: number[]) {
        if (event.eventType == PluginEventType.KeyDown) {
            let keybordEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
            if (
                interestedKeyCodes.indexOf(keybordEvent.which) >= 0 &&
                !keybordEvent.ctrlKey &&
                !keybordEvent.altKey &&
                !keybordEvent.metaKey
            ) {
                // Checks if cursor on a list
                let listState = cacheGetListState(this.editor, event);
                if (
                    listState &&
                    (listState == ListState.Bullets || listState == ListState.Numbering)
                ) {
                    return true;
                }
            }
        }

        return false;
    }
}
