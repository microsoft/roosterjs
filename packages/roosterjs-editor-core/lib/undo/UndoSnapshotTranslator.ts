import Editor from '../editor/Editor';
import { UndoSnapshot, SavedSelection } from 'roosterjs-editor-types';
import { UndoSnapshotTranslatorService } from '../editor/UndoSnapshotTranslatorService';
import { getSavedSelection, getRangeFromSavedSelection } from './savedSelection';

/**
 * What we are treating the opaque type UndoSnapshot as in
 * the context of the class
 */
type PrivateUndoSnapshot = {
    snapshotSelection: SavedSelection,
    snapshotContent: string,
}

export class UndoSnapshotTranslator implements UndoSnapshotTranslatorService {
    private editor: Editor;
    constructor(private editorRootDiv: HTMLDivElement) {
    }

    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    public getUndoSnapshot(): UndoSnapshot {
        let snapshotContent = this.editor.getContent(
            false /*triggerExtractContentEvent*/,
            true /*markSelection*/
        );
        const selectionRange = this.editor.getSelectionRange();
        let snapshotSelection =
            selectionRange !== null ? getSavedSelection(selectionRange, this.editorRootDiv) : null;
        return {
            snapshotSelection,
            snapshotContent,
        } as unknown as UndoSnapshot;
    }

    public restoreUndoSnapshot(snapshot: UndoSnapshot): void {
        const nonOpaqueSnapshot = snapshot as unknown as PrivateUndoSnapshot;
        this.editor.setContent(nonOpaqueSnapshot.snapshotContent);
        // SetContent runs plugins which can break up text nodes in the DOM.
        // In order to ensure that we have a consistent representation of the DOM as
        // if it were just inserted (e.g. with no adjacent text nodes),
        // we normalize the DOM.
        //
        // This does not trigger a reflow.
        this.editorRootDiv.normalize();

        // Select after setting content because the saved
        // selections are meant to work on the re-parsed DOM.
        if (nonOpaqueSnapshot.snapshotSelection !== null) {
            let selectionRange = getRangeFromSavedSelection(
                nonOpaqueSnapshot.snapshotSelection,
                this.editorRootDiv
            );
            this.editor.select(selectionRange);
        }
    }
}