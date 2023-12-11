import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Undo to last undo snapshot
 * @param editor The editor to undo with
 */
export function undo(editor: IStandaloneEditor): void {
    editor.focus();

    const manager = editor.getSnapshotsManager();

    if (manager.hasNewContent) {
        editor.takeSnapshot();
    }

    const snapshot = manager.move(-1);

    if (snapshot) {
        editor.restoreSnapshot(snapshot);
    }
}
