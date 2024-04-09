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
