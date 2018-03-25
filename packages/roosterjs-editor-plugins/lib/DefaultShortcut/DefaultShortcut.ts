import { Browser } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginDomEvent, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';

const KEY_B = 66;
const KEY_I = 73;
const KEY_U = 85;
const KEY_Y = 89;
const KEY_Z = 90;
const KEY_PERIOD = 190;
const KEY_FORWARDSLASH = 191;

const enum Command {
    None,
    Bold,
    Italic,
    Underline,
    Undo,
    Redo,
    Bullet,
    Numbering,
}

interface ShortcutCommand {
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    which: number;
    command: Command;
}

function createShortcutCommand(
    metaKey: boolean,
    ctrlKey: boolean,
    shiftKey: boolean,
    which: number,
    command: Command
): ShortcutCommand {
    return {
        metaKey: metaKey,
        ctrlKey: ctrlKey,
        shiftKey: shiftKey,
        which: which,
        command: command,
    };
}

let macCommands: ShortcutCommand[] = [
    // Bold for Mac: Command (Meta) + B
    createShortcutCommand(
        true /*metaKey*/,
        false /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_B,
        Command.Bold
    ),

    // Italic for Mac: Command (Meta) + I
    createShortcutCommand(
        true /*metaKey*/,
        false /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_I,
        Command.Italic
    ),

    // Underline for Mac: Command (Meta) + U
    createShortcutCommand(
        true /*metaKey*/,
        false /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_U,
        Command.Underline
    ),

    // Undo for Mac: Command (Meta) + Z
    createShortcutCommand(
        true /*metaKey*/,
        false /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_Z,
        Command.Undo
    ),

    // Redo for Mac: Command (meta) + SHIFT + Z
    createShortcutCommand(
        true /*metaKey*/,
        false /*ctrlKey*/,
        true /*shiftKey*/,
        KEY_Z,
        Command.Redo
    ),

    // Bullet for Mac: Command (meta) + .
    createShortcutCommand(
        true /*metaKey*/,
        false /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_PERIOD,
        Command.Bullet
    ),

    // Numbering for Mac: Command (meta) + /
    createShortcutCommand(
        true /*metaKey*/,
        false /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_FORWARDSLASH,
        Command.Numbering
    ),
];

let winCommands: ShortcutCommand[] = [
    // Bold for Windows: Ctrl + B
    createShortcutCommand(
        false /*metaKey*/,
        true /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_B,
        Command.Bold
    ),

    // Italic for Windows: Ctrl + I
    createShortcutCommand(
        false /*metaKey*/,
        true /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_I,
        Command.Italic
    ),

    // Underline for Windows: Ctrl + U
    createShortcutCommand(
        false /*metaKey*/,
        true /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_U,
        Command.Underline
    ),

    // Undo for Windows: Ctrl + Z
    createShortcutCommand(
        false /*metaKey*/,
        true /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_Z,
        Command.Undo
    ),

    // Redo for Windows: Ctrl + Y
    createShortcutCommand(
        false /*metaKey*/,
        true /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_Y,
        Command.Redo
    ),

    // Bullet for Windows: Ctrl + .
    createShortcutCommand(
        false /*metaKey*/,
        true /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_PERIOD,
        Command.Bullet
    ),

    // Numbering for Windows: Ctrl + /
    createShortcutCommand(
        false /*metaKey*/,
        true /*ctrlKey*/,
        false /*shiftKey*/,
        KEY_FORWARDSLASH,
        Command.Numbering
    ),
];

// Try get command from the event
function tryGetCommandFromEvent(event: PluginEvent): Command {
    if (event.eventType == PluginEventType.KeyDown) {
        let commands = Browser.isMac ? macCommands : winCommands;
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        for (let cmd of commands) {
            if (
                !keyboardEvent.altKey &&
                cmd.ctrlKey == keyboardEvent.ctrlKey &&
                cmd.metaKey == keyboardEvent.metaKey &&
                cmd.shiftKey == keyboardEvent.shiftKey &&
                cmd.which == keyboardEvent.which
            ) {
                return cmd.command;
            }
        }
    }

    return Command.None;
}

/**
 * An editor plugin to respond to default common keyboard short
 * i.e. Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y
 */
export default class DefaultShortcut implements EditorPlugin {
    private editor: Editor;

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        this.editor = null;
    }

    /**
     * Handle the event if it is a tab event, and cursor is at begin of a list
     */
    public willHandleEventExclusively(event: PluginEvent): boolean {
        let command = tryGetCommandFromEvent(event);
        return command != Command.None;
    }

    /**
     * Handle the event
     */
    public onPluginEvent(event: PluginEvent): void {
        let command = tryGetCommandFromEvent(event);
        if (!command) {
            return;
        }

        let commandExecuted = true;
        switch (command) {
            case Command.Bold:
                toggleBold(this.editor);
                break;
            case Command.Italic:
                toggleItalic(this.editor);
                break;
            case Command.Underline:
                toggleUnderline(this.editor);
                break;
            case Command.Undo:
                this.editor.undo();
                break;
            case Command.Redo:
                this.editor.redo();
                break;
            case Command.Bullet:
                toggleBullet(this.editor);
                break;
            case Command.Numbering:
                toggleNumbering(this.editor);
                break;
            default:
                commandExecuted = false;
        }

        if (commandExecuted) {
            (event as PluginDomEvent).rawEvent.preventDefault();
            (event as PluginDomEvent).rawEvent.stopPropagation();
        }
    }
}
