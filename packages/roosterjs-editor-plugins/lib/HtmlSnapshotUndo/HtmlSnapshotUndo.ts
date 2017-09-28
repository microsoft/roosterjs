import { Undo } from 'roosterjs-editor-core';

/**
 * @deprecated Please use Undo class from roosterjs-editor-core instead
 * An editor plugin that manages undo history
 */
export default class HtmlSnapshotUndo extends Undo {
    constructor(private snapshotOnSpace: boolean = true, private snapshotOnEnter: boolean = true) {
        super();
    }
}
