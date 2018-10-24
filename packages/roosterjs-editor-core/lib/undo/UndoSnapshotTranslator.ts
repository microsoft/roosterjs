import { Editor } from 'roosterjs-editor-core';

/**
 * Opaque type alias for Undo snapshots.
 *
 * It can only reasonably be created in this class, so we can enforce that
 * this service can swap out the type of the UndoSnapshot under the hood
 * safely
 *
 * See https://github.com/Microsoft/TypeScript/issues/15807
 */
export type UndoSnapshot = string & { _tag: "undo-snapshot-type-alias" };

export class UndoSnapshotTranslator {
    private editor: Editor;
    constructor(
        private editorRoot: HTMLDivElement,
    ) {}

    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    public getUndoSnapshot(): UndoSnapshot {
        let snapshotContent = this.editor.getContent(
            false /*triggerExtractContentEvent*/,
            true /*markSelection*/
        );
        return snapshotContent as UndoSnapshot;
    }

    public restoreUndoSnapshot(snapshot: UndoSnapshot): void {
        this.editor.setContent(
            (<string>snapshot), // content
            true, // triggerContentChangedEvent
        );
    }
}