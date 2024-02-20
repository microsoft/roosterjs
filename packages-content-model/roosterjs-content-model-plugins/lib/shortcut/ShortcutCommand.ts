import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Represents a command for shortcut
 */
export interface ShortcutCommand {
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
     * Key for this shortcut. The value should be the value of KeyboardEvent.key string
     */
    key: string;

    /**
     * The callback function to invoke when this shortcut is triggered
     * @param editor The editor object
     */
    onCommand: (editor: IEditor) => void;

    /**
     * Whether this command is disabled. By default it is treated as false
     * @param editor The editor object
     */
    isDisabled?: (editor: IEditor) => boolean;
}
