/**
 * Delete selection result
 */
export type DeleteResult =
    /**
     * Content Model could not finish deletion, need to let browser handle it
     */
    | 'notDeleted'

    /**
     * Deleted a single char, no need to let browser keep handling
     */
    | 'singleChar'

    /**
     * Deleted a range, no need to let browser keep handling
     */
    | 'range'

    /**
     * There is nothing to delete, no need to let browser keep handling
     */
    | 'nothingToDelete';
