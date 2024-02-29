import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Definition of the shortcut key
 */
export interface ShortcutKeyDefinition {
    /**
     * Modifier key for this shortcut, allowed values are:
     * ctrl: Ctrl key (or Meta key on MacOS)
     * alt: Alt key
     */
    modifierKey: 'ctrl' | 'alt';

    /**
     * Whether ALT key is required for this shortcut
     */
    shiftKey: boolean;

    /**
     * Key code for this shortcut. The value should be the value of KeyboardEvent.which
     * We are still using key code here rather than key name (event.key)  although event.which is deprecated because of globalization.
     * For example, on US keyboard, Shift+Comma="<" but on Spanish keyboard it is ":"
     * And we still want the shortcut key to be registered on  the same key, in that case key name is different but key code keeps the same.
     */
    which: number;
}

/**
 * Represents a command for shortcut
 */
export interface ShortcutCommand {
    /**
     * Definition of the shortcut key
     */
    shortcutKey: ShortcutKeyDefinition;

    /**
     * @optional Required environment for this command
     * all: (Default) This feature is available for all environments
     * mac: This feature is available on MacOS only
     * nonMac: This feature is available on OS other than MacOS
     */
    environment?: 'all' | 'mac' | 'nonMac';

    /**
     * The callback function to invoke when this shortcut is triggered
     * @param editor The editor object
     */
    onClick: (editor: IEditor) => void;
}
