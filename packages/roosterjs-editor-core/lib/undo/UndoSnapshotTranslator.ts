import { Editor } from 'roosterjs-editor-core';
import { UndoSnapshot } from 'roosterjs-editor-types';

export class UndoSnapshotTranslator {
    private editor: Editor;

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