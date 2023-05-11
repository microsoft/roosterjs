import { restoreContentWithEntityPlaceholder } from 'roosterjs-editor-dom';
import { selectContentMetadata } from './utils/selectContentMetadata';
import {
    ChangeSource,
    ColorTransformDirection,
    EditorCore,
    PluginEventType,
    RestoreUndoSnapshot,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export const restoreUndoSnapshot: RestoreUndoSnapshot = (core: EditorCore, step: number) => {
    if (core.undo.hasNewContent && step < 0) {
        core.api.addUndoSnapshot(
            core,
            null /*callback*/,
            null /*changeSource*/,
            false /*canUndoByBackspace*/
        );
    }

    const snapshot = core.undo.snapshotsService.move(step);

    if (snapshot && snapshot.html != null) {
        try {
            core.undo.isRestoring = true;

            const { html, entities, metadata, entitySnapshot } = snapshot;
            const body = new DOMParser().parseFromString(core.trustedHTMLHandler(html), 'text/html')
                .body;

            restoreContentWithEntityPlaceholder(body, core.contentDiv, entities || {});

            const isDarkMode = core.lifecycle.isDarkMode;

            if ((!metadata && isDarkMode) || (metadata && !!metadata.isDarkMode != !!isDarkMode)) {
                core.api.transformColor(
                    core,
                    core.contentDiv,
                    false /*includeSelf*/,
                    null /*callback*/,
                    isDarkMode
                        ? ColorTransformDirection.LightToDark
                        : ColorTransformDirection.DarkToLight,
                    true /*forceTransform*/
                );
            }

            if (metadata) {
                selectContentMetadata(core, metadata);
            }

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.ContentChanged,
                    source: entitySnapshot ? ChangeSource.UndoEntity : ChangeSource.Undo,
                    data: entitySnapshot,
                },
                false
            );

            const darkColorHandler = core.darkColorHandler;
            const isDarkModel = core.lifecycle.isDarkMode;

            snapshot.knownColors.forEach(color => {
                darkColorHandler.registerColor(
                    color.lightModeColor,
                    isDarkModel,
                    color.darkModeColor
                );
            });
        } finally {
            core.undo.isRestoring = false;
        }
    }
};
