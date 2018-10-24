import Editor from './Editor';
import { UndoSnapshot } from '../undo/UndoSnapshotTranslator';

export default interface UndoSnapshotTranslatorService {
    initialize(editor: Editor): void;
    restoreUndoSnapshot(snapshot: UndoSnapshot): void;
    getUndoSnapshot(): UndoSnapshot;
}