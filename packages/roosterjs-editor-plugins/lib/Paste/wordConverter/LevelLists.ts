import ListMetadata from './ListMetadata';

/** Holds the ids for the lists already seen for a specified level */
export default interface LevelLists {
    /**
     * The metadata for the lists seen at  this level
     * key: word list id, value: list metadata
     */
    listsMetadata: { [key: string]: ListMetadata };

    /** Unique id of the list currently at this level */
    currentUniqueListId: number;
}

/** create an empty LevelLists */
export function createLevelLists(): LevelLists {
    return {
        listsMetadata: {},
        currentUniqueListId: -1,
    };
}
