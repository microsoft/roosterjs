import type { PickerHelper } from './PickerHelper';
import type { DOMInsertPoint } from 'roosterjs-content-model-types';

/**
 * Direction option for picker
 */
export type PickerDirection =
    /**
     * Show options horizontally
     */
    | 'horizontal'
    /**
     * Show options vertically
     */
    | 'vertical'

    /**
     * Show options in both direction (2-D picker)
     */
    | 'both';

/**
 * Change mode that PickerPlugin will pass to child class
 */
export type PickerSelectionChangMode =
    /**
     * When user press Right ("horizontal" mode or "both" mode) (Left in RTL) or Down ("vertical" mode),
     * select the next option
     */
    | 'next'

    /**
     * When user press Left ("horizontal" mode or "both" mode) (Right in RTL) or Up ("vertical" mode),
     * select the previous option
     */
    | 'previous'

    /**
     * When user press Down ("both" mode),
     * select the next row
     */
    | 'nextRow'

    /**
     * When user press Up ("both" mode),
     * select the previous row
     */
    | 'previousRow'

    /**
     * When user press PageDown,
     * switch to next page
     */
    | 'nextPage'

    /**
     * When user press PageUp,
     * switch to previous page
     */
    | 'previousPage'

    /**
     * When user press Home,
     * Select the first item in current row
     */
    | 'firstInRow'

    /**
     * When user press End,
     * Select the last item in current row
     */
    | 'lastInRow'

    /**
     * When user press CTRL (or META on Mac) + Home,
     * Select the very first item
     */
    | 'first'

    /**
     * When user press CTRL (or META on Mac) + End,
     * Select the very last item
     */
    | 'last';

/**
 * Represents the interface a handler for picker plugin. Developer need to implement this interface to create a new type of picker
 */
export interface PickerHandler {
    /**
     * Initialize the picker handler, pass in editor and PickerPlugin instance so that the handler can save them
     * @param editor The editor instance
     * @param pickerPlugin The PickerPlugin instance
     */
    onInitialize: (helper: PickerHelper) => void;

    /**
     * Dispose the picker handler
     */
    onDispose: () => void;

    /**
     * Notify the picker handler that user has typed trigger character so handler should show picker now
     * @param queryString Current query string
     * @param insertPoint Insert point where user is typing, can be used for calculating picker position
     * @returns A picker direction to let picker plugin know what kind of picker is opened. Picker plugin will use this value
     * to decide how to handle keyboard event to change selection. Return null means picker is not actually opened
     */
    onTrigger: (queryString: string, insertPoint: DOMInsertPoint) => PickerDirection | null;

    /**
     * Notify the picker handler that picker should be closed now
     */
    onClosePicker?(): void;

    /**
     * Notify the picker handler that user has changed current typed query string
     */
    onQueryStringChanged?(queryString: string): void;

    /**
     * Notify the picker handler that user has decide to select the current option in picker
     */
    onSelect?(): void;

    /**
     * Notify the picker handler that user is using keyboard to change current selection
     * @param mode The moving mode. Handler code can use this value to decide which item need to be selected
     */
    onSelectionChanged?(mode: PickerSelectionChangMode): void;
}
