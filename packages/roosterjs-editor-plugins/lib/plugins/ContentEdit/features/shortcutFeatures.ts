import { Browser, cacheGetEventData } from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    FontSizeChange,
    IEditor,
    Keys,
    PluginEventType,
    PluginKeyboardEvent,
    ShortcutFeatureSettings,
} from 'roosterjs-editor-types';
import {
    changeFontSize,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBullet,
    toggleNumbering,
    clearFormat,
} from 'roosterjs-editor-api';

interface ShortcutCommand {
    winKey: number;
    macKey: number;
    action: (editor: IEditor) => any;
}

function createCommand(
    winKey: number,
    macKey: number,
    action: (editor: IEditor) => any,
    disabled: boolean = false
) {
    if (disabled) {
        return null;
    }
    return {
        winKey,
        macKey,
        action,
    };
}

const commands: ShortcutCommand[] = [
    createCommand(Keys.Ctrl | Keys.B, Keys.Meta | Keys.B, toggleBold),
    createCommand(Keys.Ctrl | Keys.I, Keys.Meta | Keys.I, toggleItalic),
    createCommand(Keys.Ctrl | Keys.U, Keys.Meta | Keys.U, toggleUnderline),
    createCommand(Keys.Ctrl | Keys.SPACE, Keys.Meta | Keys.SPACE, clearFormat),
    createCommand(Keys.Ctrl | Keys.Z, Keys.Meta | Keys.Z, editor => editor.undo()),
    createCommand(
        Keys.ALT | Keys.BACKSPACE,
        Keys.ALT | Keys.BACKSPACE,
        editor => editor.undo(),
        Browser.isMac /* Option+Backspace to be handled by browsers on Mac */
    ),
    createCommand(Keys.Ctrl | Keys.Y, Keys.Meta | Keys.Shift | Keys.Z, editor => editor.redo()),
    createCommand(Keys.Ctrl | Keys.PERIOD, Keys.Meta | Keys.PERIOD, toggleBullet),
    createCommand(Keys.Ctrl | Keys.FORWARD_SLASH, Keys.Meta | Keys.FORWARD_SLASH, toggleNumbering),
    createCommand(
        Keys.Ctrl | Keys.Shift | Keys.PERIOD,
        Keys.Meta | Keys.Shift | Keys.PERIOD,
        editor => changeFontSize(editor, FontSizeChange.Increase)
    ),
    createCommand(
        Keys.Ctrl | Keys.Shift | Keys.COMMA,
        Keys.Meta | Keys.Shift | Keys.COMMA,
        editor => changeFontSize(editor, FontSizeChange.Decrease)
    ),
].filter((command): command is ShortcutCommand => !!command);

/**
 * DefaultShortcut edit feature, provides shortcuts for the following features:
 * Ctrl/Meta+B: toggle bold style
 * Ctrl/Meta+I: toggle italic style
 * Ctrl/Meta+U: toggle underline style
 * Ctrl/Meta+Space: clear formatting
 * Alt+Backspace: undo
 * Ctrl/Meta+Z: undo
 * Ctrl+Y/Meta+Shift+Z: redo
 * Ctrl/Meta+PERIOD: toggle bullet list
 * Ctrl/Meta+/: toggle numbering list
 * Ctrl/Meta+Shift+>: increase font size
 * Ctrl/Meta+Shift+<: decrease font size
 */
const DefaultShortcut: BuildInEditFeature<PluginKeyboardEvent> = {
    allowFunctionKeys: true,
    keys: [
        Keys.B,
        Keys.I,
        Keys.U,
        Keys.Y,
        Keys.Z,
        Keys.COMMA,
        Keys.PERIOD,
        Keys.FORWARD_SLASH,
        Keys.SPACE,
        Keys.BACKSPACE,
    ],
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

function cacheGetCommand(event: PluginKeyboardEvent) {
    return cacheGetEventData(event, 'DEFAULT_SHORT_COMMAND', () => {
        let e = event.rawEvent;
        let key =
            // Need to check AltGraph isn't being pressed since some languages (e.g. Polski) use AltGr
            // to input some special characters. In that case, ctrlKey and altKey are both true in Edge,
            // but we should not trigger any shortcut function here. However, we still want to capture
            // the ALT+BACKSPACE combination.
            event.eventType == PluginEventType.KeyDown && !e.getModifierState('AltGraph')
                ? e.which |
                  (<number>(e.metaKey && Keys.Meta)) |
                  (<number>(e.shiftKey && Keys.Shift)) |
                  (<number>(e.ctrlKey && Keys.Ctrl)) |
                  (<number>(e.altKey && Keys.ALT))
                : 0;
        return key && commands.filter(cmd => (Browser.isMac ? cmd.macKey : cmd.winKey) == key)[0];
    });
}

/**
 * @internal
 */
export const ShortcutFeatures: Record<
    keyof ShortcutFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    defaultShortcut: DefaultShortcut,
};
