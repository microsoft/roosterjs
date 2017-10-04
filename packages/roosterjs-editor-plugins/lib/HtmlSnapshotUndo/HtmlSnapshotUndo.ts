import { Undo } from 'roosterjs-editor-core';

/**
 * @deprecated Please use Undo class from roosterjs-editor-core instead
 * An editor plugin that manages undo history
 */
export default class HtmlSnapshotUndo extends Undo {
    constructor(snapshotOnSpace: boolean = true, snapshotOnEnter: boolean = true) {
        super();
    }
}
