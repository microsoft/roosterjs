import Editor from './Editor';
import { UndoSnapshot } from 'roosterjs-editor-types';

export interface UndoSnapshotTranslatorService {
    initialize(editor: Editor): void;
    restoreUndoSnapshot(snapshot: UndoSnapshot): void;
    getUndoSnapshot(): UndoSnapshot;
}

export default UndoSnapshotTranslatorService;
