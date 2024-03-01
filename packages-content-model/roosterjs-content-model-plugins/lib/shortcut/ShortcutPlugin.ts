import { cacheGetEventData } from 'roosterjs-content-model-core';
import type { ShortcutCommand, ShortcutKeyDefinition } from './ShortcutCommand';
import {
    ShortcutBold,
    ShortcutBullet,
    ShortcutClearFormat,
    ShortcutDecreaseFont,
    ShortcutIncreaseFont,
    ShortcutItalic,
    ShortcutNumbering,
    ShortcutRedo,
    ShortcutRedoMacOS,
    ShortcutUnderline,
    ShortcutUndo,
    ShortcutUndo2,
} from './shortcuts';
import type {
    EditorPlugin,
    IEditor,
    KeyDownEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';

const defaultShortcuts: ShortcutCommand[] = [
    ShortcutBold,
    ShortcutItalic,
    ShortcutUnderline,
    ShortcutClearFormat,
    ShortcutUndo,
    ShortcutUndo2,
    ShortcutRedo,
    ShortcutRedoMacOS,
    ShortcutBullet,
    ShortcutNumbering,
    ShortcutIncreaseFont,
    ShortcutDecreaseFont,
];
const CommandCacheKey = '__ShortcutCommandCache';

/**
 * Shortcut plugin hook on the specified shortcut keys and trigger related format API
 */
export class ShortcutPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private isMac = false;

    /**
     * Create a new instance of ShortcutPlugin
     * @param [shortcuts=defaultShortcuts] Allowed commands
     */
    constructor(private shortcuts: ShortcutCommand[] = defaultShortcuts) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Shortcut';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.isMac = !!this.editor.getEnvironment().isMac;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
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
        return (
            event.eventType == 'keyDown' &&
            (event.rawEvent.ctrlKey || event.rawEvent.altKey || event.rawEvent.metaKey) &&
            !!this.cacheGetCommand(event)
        );
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor && event.eventType == 'keyDown') {
            const command = this.cacheGetCommand(event);

            if (command) {
                command.onClick(this.editor);
                event.rawEvent.preventDefault();
            }
        }
    }

    private cacheGetCommand(event: KeyDownEvent) {
        return cacheGetEventData(event, CommandCacheKey, event => {
            const editor = this.editor;

            return (
                editor &&
                this.shortcuts.filter(
                    command =>
                        this.matchOS(command.environment) &&
                        this.matchShortcut(command.shortcutKey, event.rawEvent)
                )[0]
            );
        });
    }

    private matchOS(environment?: 'all' | 'mac' | 'nonMac') {
        switch (environment) {
            case 'mac':
                return this.isMac;

            case 'nonMac':
                return !this.isMac;

            default:
                return true;
        }
    }

    private matchShortcut(shortcutKey: ShortcutKeyDefinition, event: KeyboardEvent) {
        const { ctrlKey, altKey, shiftKey, which, metaKey } = event;
        const ctrlOrMeta = this.isMac ? metaKey : ctrlKey;
        const matchModifier =
            (shortcutKey.modifierKey == 'ctrl' && ctrlOrMeta && !altKey) ||
            (shortcutKey.modifierKey == 'alt' && altKey && !ctrlOrMeta);

        return matchModifier && shiftKey == shortcutKey.shiftKey && shortcutKey.which == which;
    }
}
