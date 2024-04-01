import type { LogicalRootChangedEvent, SetLogicalRoot } from 'roosterjs-content-model-types';

/**
 * @internal
 * Change which node is the current logical root
 * @param core The StandaloneEditorCore object
 * @param logicalRoot The new logical root (has to be child of physicalRoot), pass null to use physicalRoot as logical root
 */
export const setLogicalRoot: SetLogicalRoot = (core, logicalRoot) => {
    // make sure we either want to reset to physical root or the logical root is a child of physical root
    if (!logicalRoot || core.physicalRoot.contains(logicalRoot)) {
        // if null, reset to physical root
        if (!logicalRoot) {
            logicalRoot = core.physicalRoot;
        }

        // if the logical root changed
        if (logicalRoot !== core.logicalRoot) {
            // make sure the old logical root is not content editable and the new one is
            core.logicalRoot.contentEditable = 'false';
            logicalRoot.contentEditable = 'true';

            // update the logical root
            core.logicalRoot = logicalRoot;

            // clear internal caches
            core.selection.selection = null;
            core.cache.cachedModel = undefined;
            core.cache.cachedSelection = undefined;

            // tell plugins in case they need to clear their caches
            const event: LogicalRootChangedEvent = {
                eventType: 'logicalRootChanged',
                logicalRoot,
            };
            core.api.triggerEvent(core, event, false /*broadcast*/);
        }
    } else {
        return null;
    }
};
