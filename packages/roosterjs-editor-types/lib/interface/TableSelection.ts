import Coordinates from './Coordinates';

/**
 * Represents a selection made inside of a table
 */
export default interface TableSelection {
    /**
     * First Cell selection x and y position in the table
     */
    firstCell: Coordinates;

    /**
     * Last Cell selection x and y position in the table
     */
    lastCell: Coordinates;

    /**
     * Path of selection done by the user.
     */
    selectionPath: Coordinates[];
}
