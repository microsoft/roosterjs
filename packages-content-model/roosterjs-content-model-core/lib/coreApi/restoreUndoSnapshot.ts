import { ChangeSource } from '../constants/ChangeSource';
import { ColorTransformDirection, PluginEventType } from 'roosterjs-editor-types';
import {
    getAllEntityWrappers,
    isEntityElement,
    isNodeOfType,
    parseEntityClassName,
    reuseCachedElement,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelContentChangedEvent,
    ContentModelEntityFormat,
    DOMSelection,
    RestoreUndoSnapshot,
    StandaloneEditorCore,
    UndoSnapshot,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export const restoreUndoSnapshot: RestoreUndoSnapshot = (core, step) => {
    if (core.undo.hasNewContent && step < 0) {
        core.api.appendSnapshot(core, false /*canUndoByBackspace*/);
    }

    const snapshot = core.undo.snapshotsService.move(step);

    if (snapshot && snapshot.html != null) {
        const body = new DOMParser().parseFromString(
            core.trustedHTMLHandler?.(snapshot.html) ?? snapshot.html,
            'text/html'
        ).body;

        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.BeforeSetContent,
                newContent: snapshot.html,
            },
            true /*broadcast*/
        );

        let refNode: Node | null = core.contentDiv.firstChild;

        try {
            core.undo.isRestoring = true;

            for (let currentNode = body.firstChild; currentNode; ) {
                const next = currentNode.nextSibling;
                const originalEntityElement = tryGetEntityElement(core, currentNode);

                if (originalEntityElement) {
                    refNode = reuseCachedElement(core.contentDiv, originalEntityElement, refNode);
                } else {
                    core.contentDiv.insertBefore(currentNode, refNode);

                    if (isNodeOfType(currentNode, 'ELEMENT_NODE')) {
                        const childEntities = getAllEntityWrappers(currentNode);

                        childEntities.forEach(element => {
                            const wrapper = tryGetEntityElement(core, element);

                            if (wrapper) {
                                element.parentNode?.replaceChild(wrapper, element);
                            }
                        });
                    }
                }
                currentNode = next;
            }

            while (refNode) {
                const next = refNode.nextSibling;

                refNode.parentNode?.removeChild(refNode);
                refNode = next;
            }

            const selection = getSelectionFromSnapshot(core.contentDiv, snapshot);

            core.api.setDOMSelection(core, selection);

            const isDarkMode = core.lifecycle.isDarkMode;
            const darkColorHandler = core.darkColorHandler;

            snapshot.knownColors.forEach(color => {
                darkColorHandler.registerColor(
                    color.lightModeColor,
                    isDarkMode,
                    color.darkModeColor
                );
            });

            if (!!snapshot.isDarkMode != !!isDarkMode) {
                core.api.transformColor(
                    core,
                    core.contentDiv,
                    false /*includeSelf*/,
                    null /*callback*/,
                    isDarkMode
                        ? ColorTransformDirection.LightToDark
                        : ColorTransformDirection.DarkToLight,
                    true /*forceTransform*/,
                    snapshot.isDarkMode
                );
            }

            const event: ContentModelContentChangedEvent = {
                eventType: PluginEventType.ContentChanged,
                entityStates: snapshot.entityStates,
                source: ChangeSource.SetContent,
            };

            core.api.triggerEvent(core, event, false /*broadcast*/);
        } finally {
            core.undo.isRestoring = false;
        }
    }
};

function tryGetEntityElement(core: StandaloneEditorCore, node: Node): HTMLElement | null {
    let result: HTMLElement | null = null;

    if (isNodeOfType(node, 'ELEMENT_NODE') && isEntityElement(node)) {
        const format: ContentModelEntityFormat = {};

        node.classList.forEach(name => {
            parseEntityClassName(name, format);
        });

        result = (format.id && core.entity.entityMap[format.id]?.element) || null;
    }

    return result;
}

function getSelectionFromSnapshot(
    contentDiv: HTMLElement,
    snapshot: UndoSnapshot
): DOMSelection | null {
    switch (snapshot.type) {
        case 'range':
            const startPos = getPositionFromPath(contentDiv, snapshot.start);
            const endPos = getPositionFromPath(contentDiv, snapshot.end);
            const range = contentDiv.ownerDocument.createRange();

            range.setStart(startPos.node, startPos.offset);
            range.setEnd(endPos.node, endPos.offset);

            return {
                type: 'range',
                range,
            };
        case 'table':
            const table = contentDiv.querySelector('#' + snapshot.tableId) as HTMLTableElement;

            return table
                ? {
                      type: 'table',
                      table: table,
                      firstColumn: snapshot.firstColumn,
                      firstRow: snapshot.firstRow,
                      lastColumn: snapshot.lastColumn,
                      lastRow: snapshot.lastRow,
                  }
                : null;
        case 'image':
            const image = contentDiv.querySelector('#' + snapshot.imageId) as HTMLImageElement;

            return image
                ? {
                      type: 'image',
                      image: image,
                  }
                : null;
        default:
            return null;
    }
}

function getPositionFromPath(node: Node, path: number[]): { node: Node; offset: number } {
    // Iterate with a for loop to avoid mutating the passed in element path stack
    // or needing to copy it.
    let offset: number = 0;

    for (let i = 0; i < path.length; i++) {
        offset = path[i];

        if (
            i < path.length - 1 &&
            node &&
            isNodeOfType(node, 'ELEMENT_NODE') &&
            node.childNodes.length > offset
        ) {
            node = node.childNodes[offset];
        } else {
            break;
        }
    }

    return { node, offset };
}
