/**
 * Opaque type alias for Undo snapshots.
 *
 * It can only be created via casting, so consumers outside of
 * UndoSnapshotTranslator cannot reasonably look in to the class and
 * expect non-breaking changes.
 *
 * See https://github.com/Microsoft/TypeScript/issues/15807
 */

export type UndoSnapshot = string & {tag: "undo-snapshot-opaque-type"};

export default UndoSnapshot;
