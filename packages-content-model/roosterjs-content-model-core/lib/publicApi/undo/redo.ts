import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Redo to next undo snapshot
 * @param editor The editor to undo with
 */
export function redo(editor: IEditor): void {
    editor.focus();

    const manager = editor.getSnapshotsManager();
    const snapshot = manager.move(1);

    if (snapshot) {
        editor.restoreSnapshot(snapshot);
    }
}
