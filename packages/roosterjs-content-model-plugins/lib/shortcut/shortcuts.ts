import { redo, undo } from 'roosterjs-content-model-core';
import { setShortcutIndentationCommand } from './utils/setShortcutIndentationCommand';
import {
    changeFontSize,
    clearFormat,
    toggleBold,
    toggleBullet,
    toggleItalic,
    toggleNumbering,
    toggleUnderline,
} from 'roosterjs-content-model-api';
import type { ShortcutCommand } from './ShortcutCommand';

const enum Keys {
    BACKSPACE = 8,
    SPACE = 32,
    B = 66,
    I = 73,
    U = 85,
    Y = 89,
    Z = 90,
    COMMA = 188,
    PERIOD = 190,
    FORWARD_SLASH = 191,
    ArrowRight = 39,
    ArrowLeft = 37,
}

/**
 * Shortcut command for Bold
 * Windows: Ctrl + B
 * MacOS: Meta + B
 */
export const ShortcutBold: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.B,
    },
    onClick: editor => toggleBold(editor),
};

/**
 * Shortcut command for Italic
 * Windows: Ctrl + I
 * MacOS: Meta + I
 */
export const ShortcutItalic: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.I,
    },
    onClick: editor => toggleItalic(editor),
};

/**
 * Shortcut command for Underline
 * Windows: Ctrl + U
 * MacOS: Meta + U
 */
export const ShortcutUnderline: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.U,
    },
    onClick: editor => toggleUnderline(editor),
};

/**
 * Shortcut command for Clear Format
 * Windows: Ctrl + Space
 * MacOS: Meta + Space, this shortcut is the same as the default global spotlight shortcut, so it is invalid if the user keeps spotlight‘s.
 */
export const ShortcutClearFormat: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.SPACE,
    },
    onClick: editor => clearFormat(editor),
};

/**
 * Shortcut command for Undo 1
 * Windows: Ctrl + Z
 * MacOS: Meta + Z
 */
export const ShortcutUndo: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.Z,
    },
    onClick: editor => undo(editor),
};

/**
 * Shortcut command for Undo 2
 * Windows: Alt + Backspace
 * MacOS: N/A
 */
export const ShortcutUndo2: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'alt',
        shiftKey: false,
        which: Keys.BACKSPACE,
    },
    onClick: editor => undo(editor),
    environment: 'nonMac',
};

/**
 * Shortcut command for Redo 1
 * Windows: Ctrl + Y
 * MacOS: N/A
 */
export const ShortcutRedo: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.Y,
    },
    onClick: editor => redo(editor),
    environment: 'nonMac',
};

/**
 * @deprecated
 * Shortcut command for Redo 2
 * Windows: N/A
 * MacOS: Meta + Shift + Z
 */
export const ShortcutRedoMacOS: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: true,
        which: Keys.Z,
    },
    onClick: editor => redo(editor),
    environment: 'mac',
};

/**
 * Shortcut command for Redo 3
 * Windows: Ctrl + Shift + Z
 * MacOS: Meta + Shift + Z
 */
export const ShortcutRedoAlt: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: true,
        which: Keys.Z,
    },
    onClick: editor => redo(editor),
};

/**
 * Shortcut command for Bullet List
 * Windows: Ctrl + . (Period)
 * MacOS: Meta + . (Period)
 */
export const ShortcutBullet: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.PERIOD,
    },
    onClick: editor => toggleBullet(editor),
};

/**
 * Shortcut command for Numbering List
 * Windows: Ctrl + / (Forward slash)
 * MacOS: Meta + / (Forward slash)
 */
export const ShortcutNumbering: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: false,
        which: Keys.FORWARD_SLASH,
    },
    onClick: editor => toggleNumbering(editor),
};

/**
 * Shortcut command for Increase Font
 * Windows: Ctrl + Shift + . (Period)
 * MacOS: Meta + Shift + . (Period)
 */
export const ShortcutIncreaseFont: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: true,
        which: Keys.PERIOD,
    },
    onClick: editor => changeFontSize(editor, 'increase'),
};

/**
 * Shortcut command for Decrease Font
 * Windows: Ctrl + Shift + , (Comma)
 * MacOS: Meta + Shift + , (Comma)
 */
export const ShortcutDecreaseFont: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'ctrl',
        shiftKey: true,
        which: Keys.COMMA,
    },
    onClick: editor => changeFontSize(editor, 'decrease'),
};

/**
 * Shortcut command for Intent list
 * Windows: Alt + Shift + Arrow Right
 * MacOS: N/A
 */
export const ShortcutIndentList: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'alt',
        shiftKey: true,
        which: Keys.ArrowRight,
    },
    onClick: editor => {
        setShortcutIndentationCommand(editor, 'indent');
    },
    environment: 'nonMac',
};

/**
 * Shortcut command for Outdent list
 * Windows: Alt + Shift + Arrow Left
 * MacOS: N/A
 */
export const ShortcutOutdentList: ShortcutCommand = {
    shortcutKey: {
        modifierKey: 'alt',
        shiftKey: true,
        which: Keys.ArrowLeft,
    },
    onClick: editor => {
        setShortcutIndentationCommand(editor, 'outdent');
    },
    environment: 'nonMac',
};
