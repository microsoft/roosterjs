import { getPositionFromPath } from './getPositionFromPath';
import type { EditorCore, Snapshot } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function restoreSnapshotLogicalRoot(core: EditorCore, snapshot: Snapshot) {
    if (snapshot.logicalRootPath && snapshot.logicalRootPath.length > 0) {
        const restoredLogicalRoot = getPositionFromPath(core.physicalRoot, snapshot.logicalRootPath)
            .node as HTMLDivElement;
        if (restoredLogicalRoot !== core.logicalRoot) {
            core.api.setLogicalRoot(core, restoredLogicalRoot);
        }
    }
}
