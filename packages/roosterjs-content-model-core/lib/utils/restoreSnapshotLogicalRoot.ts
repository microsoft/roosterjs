import { getPositionFromPath } from '../utils/getPositionFromPath';
import type { Snapshot, EditorCore } from 'roosterjs-content-model-types';

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
    } else {
        core.api.setLogicalRoot(core, null);
    }
}
