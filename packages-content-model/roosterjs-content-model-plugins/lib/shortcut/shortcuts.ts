import { redo, undo } from 'roosterjs-content-model-core/lib';
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

/**
 * Shortcut command for Bold
 */
export const ShortcutBold: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: 'b',
    onCommand: editor => toggleBold(editor),
};

/**
 * Shortcut command for Italic
 */
export const ShortcutItalic: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: 'i',
    onCommand: editor => toggleItalic(editor),
};

/**
 * Shortcut command for Underline
 */
export const ShortcutUnderline: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: 'u',
    onCommand: editor => toggleUnderline(editor),
};

/**
 * Shortcut command for Clear Format
 */
export const ShortcutClearFormat: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: ' ',
    onCommand: editor => clearFormat(editor),
};

/**
 * Shortcut command for Undo
 */
export const ShortcutUndo: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: 'z',
    onCommand: editor => undo(editor),
};

/**
 * Shortcut command for Undo (Alt+Backspace, non-MacOS)
 */
export const ShortcutUndo2: ShortcutCommand = {
    modifierKey: 'alt',
    shiftKey: false,
    key: 'Backspace',
    onCommand: editor => undo(editor),
    isDisabled: editor => !!editor.getEnvironment().isMac,
};

/**
 * Shortcut command for Redo (Non-MacOS)
 */
export const ShortcutRedo: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: 'y',
    onCommand: editor => redo(editor),
    isDisabled: editor => !!editor.getEnvironment().isMac,
};

/**
 * Shortcut command for Redo (MacOS)
 */
export const ShortcutRedoMacOS: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: true,
    key: 'z',
    onCommand: editor => redo(editor),
    isDisabled: editor => !editor.getEnvironment().isMac,
};

/**
 * Shortcut command for Bullet List
 */
export const ShortcutBullet: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: '.',
    onCommand: editor => toggleBullet(editor),
};

/**
 * Shortcut command for Numbering List
 */
export const ShortcutNumbering: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: false,
    key: '/',
    onCommand: editor => toggleNumbering(editor),
};

/**
 * Shortcut command for Increase Font
 */
export const ShortcutIncreaseFont: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: true,
    key: '>',
    onCommand: editor => changeFontSize(editor, 'increase'),
};

/**
 * Shortcut command for Decrease Font
 */
export const ShortcutDecreaseFont: ShortcutCommand = {
    modifierKey: 'ctrl',
    shiftKey: true,
    key: '<',
    onCommand: editor => changeFontSize(editor, 'decrease'),
};
