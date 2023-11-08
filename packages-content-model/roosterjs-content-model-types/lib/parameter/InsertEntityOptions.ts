/**
 * Options for insertEntity API
 */
export interface InsertEntityOptions {
    /**
     * Content node of the entity. If not passed, an empty entity will be created
     */
    contentNode?: Node;

    /**
     * Whether move focus after entity after insert
     */
    focusAfterEntity?: boolean;

    /**
     * "Display" value of the entity wrapper. By default, block entity will have no display, inline entity will have display: inline-block
     */
    wrapperDisplay?: 'inline' | 'block' | 'none' | 'inline-block';

    /**
     * Whether skip adding an undo snapshot around
     */
    skipUndoSnapshot?: boolean;
}
