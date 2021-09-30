/**
 * Represents a data structure of snapshots, this is usually used for undo snapshots
 */
export default interface Snapshots {
    /**
     * The snapshot array
     */
    snapshots: string[];

    /**
     * Size of all snapshots
     */
    totalSize: number;

    /**
     * Current index
     */
    currentIndex: number;

    /**
     * Index of snapshot added before an auto complete action
     */
    autoCompleteIndex: number;

    /**
     * Max size of all snapshots
     */
    readonly maxSize: number;
}
