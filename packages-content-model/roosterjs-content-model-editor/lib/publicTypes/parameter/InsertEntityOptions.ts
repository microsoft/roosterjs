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

/**
 * Define the position of the entity to insert. It can be:
 * "focus": insert at current focus. If insert a block entity, it will be inserted under the paragraph where focus is
 * "begin": insert at beginning of content. When insert an inline entity, it will be wrapped with a paragraph.
 * "end": insert at end of content. When insert an inline entity, it will be wrapped with a paragraph.
 * "root": insert at the root level of current region
 */
export type InsertEntityPosition = 'focus' | 'begin' | 'end' | 'root';
