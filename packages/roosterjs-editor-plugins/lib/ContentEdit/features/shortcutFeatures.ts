import { Browser } from 'roosterjs-editor-dom';
import { ContentEditFeature } from '../ContentEditFeatures';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginDomEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';

const enum Keys {
    B = 66,
    I = 73,
    U = 85,
    Y = 89,
    Z = 90,
    PERIOD = 190,
    FORWARDSLASH = 191,
    Ctrl = 0x100,
    Meta = 0x200,
    Shift = 0x400,
}

interface ShortcutCommand {
    winKey: number;
    macKey: number;
    action: (editor: Editor) => any;
}

function createCommand(winKey: number, macKey: number, action: (editor: Editor) => any) {
    return {
        winKey: winKey,
        macKey: macKey,
        action: action,
    };
}

const commands: ShortcutCommand[] = [
    createCommand(Keys.Ctrl | Keys.B, Keys.Meta | Keys.B, toggleBold),
    createCommand(Keys.Ctrl | Keys.I, Keys.Meta | Keys.I, toggleItalic),
    createCommand(Keys.Ctrl | Keys.U, Keys.Meta | Keys.U, toggleUnderline),
    createCommand(Keys.Ctrl | Keys.Z, Keys.Meta | Keys.Z, editor => editor.undo()),
    createCommand(Keys.Ctrl | Keys.Y, Keys.Meta | Keys.Shift | Keys.Z, editor => editor.redo()),
    createCommand(Keys.Ctrl | Keys.PERIOD, Keys.Meta | Keys.PERIOD, toggleBullet),
    createCommand(Keys.Ctrl | Keys.FORWARDSLASH, Keys.Meta | Keys.FORWARDSLASH, toggleNumbering),
];

export const DefaultShortcut: ContentEditFeature = {
    allowFunctionKeys: true,
    keys: [Keys.B, Keys.I, Keys.U, Keys.Y, Keys.Z, Keys.PERIOD, Keys.FORWARDSLASH],
    shouldHandleEvent: cacheGetCommand,
    handleEvent: (event, editor) => {
        let command = cacheGetCommand(event);
        if (command) {
            command.action(editor);
            event.rawEvent.preventDefault();
            event.rawEvent.stopPropagation();
        }
    },
};

function cacheGetCommand(event: PluginDomEvent) {
    return cacheGetEventData(event, 'DEFAULT_SHORT_COMMAND', () => {
        let e = event.rawEvent as KeyboardEvent;
        let key =
            event.eventType == PluginEventType.KeyDown
                ? e.which |
                  (e.metaKey && Keys.Meta) |
                  (e.shiftKey && Keys.Shift) |
                  (e.ctrlKey && Keys.Ctrl)
                : 0;
        return key && commands.find(cmd => (Browser.isMac ? cmd.macKey : cmd.winKey) == key);
    });
}
