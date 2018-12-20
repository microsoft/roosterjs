import Editor from '../editor/Editor';

/**
 * @deprecated Use Editor.getContent(false, true) instead
 * Build undo snapshot
 */
export function buildSnapshot(editor: Editor): string {
    return editor.getContent(false /*triggerExtractContentEvent*/, true /*markSelection*/);
}

/**
 * @deprecated Use Editor.setContent() instead
 * Restore a snapshot
 */
export function restoreSnapshot(editor: Editor, snapshot: string): void {
    editor.setContent(snapshot);
}
