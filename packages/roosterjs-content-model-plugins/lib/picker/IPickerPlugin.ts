import type {
    ContentModelDocument,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';
import type { PickerHandler } from './PickerHandler';

/**
 * Represents the interface of picker plugin, provides necessary utility functions for pickers
 */
export interface IPickerPlugin<T extends PickerHandler> {
    /**
     * Get the picker handler connected to this plugin
     */
    readonly handler: T;

    /**
     * Replace the query string with a given Content Model.
     * This is used for commit a change from picker and insert the committed content into editor.
     * @param model The Content Model to insert
     * @param options Options for formatting content model
     * @param canUndoByBackspace Whether this change can be undone using Backspace key
     */
    replaceQueryString: (
        model: ContentModelDocument,
        options?: FormatContentModelOptions,
        canUndoByBackspace?: boolean
    ) => void;

    /**
     * Notify Picker Plugin that picker is closed from the handler code, so picker plugin can quit the suggesting state
     */
    closePicker: () => void;
}
