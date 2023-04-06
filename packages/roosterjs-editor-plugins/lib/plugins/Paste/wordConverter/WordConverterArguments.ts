import LevelLists, { createLevelLists } from './LevelLists';
import ListItemMetadata from './ListItemMetadata';
import ListMetadata from './ListMetadata';

/**
 * @internal
 * Contains the state of the WordConverter when called back after yielding
 */
export default interface WordConverterArguments {
    /** The list of element nodes being processed */
    nodes: NodeListOf<HTMLElement>;

    /** The index of the element currently being processed */
    currentIndex: number;

    /**
     * Holds the metadata for all the lists we have found
     * key: unique list id, value: list metadata
     */
    lists: { [key: string]: ListMetadata };

    /**
     * Stores the list item meta data of the items we
     * have found that need to be converted
     */
    listItems: ListItemMetadata[];

    /**
     * This array holds the list id of the lists we are processing
     * that are next to each other.. This list will be used to determine
     * if list items are next to each other or if they are separated...
     * Separated items are ignored from the conversion
     */

    currentListIdsByLevels: LevelLists[];

    /** Remembers the item that was last processed  */
    lastProcessedItem: HTMLElement | null;
}

/**
 * @internal
 * create an empty WordConverterArguments
 */
export function createWordConverterArguments(
    nodes: NodeListOf<HTMLElement>
): WordConverterArguments {
    return {
        nodes: nodes,
        currentIndex: 0,
        lists: {},
        listItems: [],
        currentListIdsByLevels: [createLevelLists()],
        lastProcessedItem: null,
    };
}
