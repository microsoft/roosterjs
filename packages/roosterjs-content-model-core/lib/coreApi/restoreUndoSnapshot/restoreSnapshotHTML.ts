import {
    getAllEntityWrappers,
    isBlockEntityContainer,
    isEntityDelimiter,
    isEntityElement,
    isNodeOfType,
    parseEntityFormat,
    reuseCachedElement,
} from 'roosterjs-content-model-dom';
import type { Snapshot, EditorCore, KnownEntityItem } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function restoreSnapshotHTML(core: EditorCore, snapshot: Snapshot) {
    const {
        physicalRoot,
        entity: { entityMap },
    } = core;
    let refNode: Node | null = physicalRoot.firstChild;

    const body = core.domCreator.htmlToDOM(snapshot.html).body;

    for (let currentNode = body.firstChild; currentNode; ) {
        const next = currentNode.nextSibling;
        const originalEntityElement = tryGetEntityElement(entityMap, currentNode);

        if (originalEntityElement) {
            // After restoring the snapshot, we need to clear the delimiter indexes since cached model will be cleared
            if (isBlockEntityContainer(originalEntityElement)) {
                for (let node = originalEntityElement.firstChild; node; node = node.nextSibling) {
                    if (isNodeOfType(node, 'ELEMENT_NODE') && isEntityDelimiter(node)) {
                        core.cache.domIndexer?.clearIndex(node);
                    }
                }
            }

            refNode = reuseCachedElement(physicalRoot, originalEntityElement, refNode);
        } else {
            physicalRoot.insertBefore(currentNode, refNode);

            if (isNodeOfType(currentNode, 'ELEMENT_NODE')) {
                const childEntities = getAllEntityWrappers(currentNode);

                childEntities.forEach(element => {
                    const wrapper = tryGetEntityElement(entityMap, element);

                    if (wrapper) {
                        if (wrapper == refNode) {
                            // In case the node we are moving is just the ref node,
                            // We create a temporary clone and insert it before the refNode, and use this cloned node as refNode
                            // After replaceChild(), the original refNode will be moved away
                            const markerNode = wrapper.cloneNode();

                            physicalRoot.insertBefore(markerNode, refNode);
                            refNode = markerNode;
                        }

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
}

function tryGetEntityElement(
    entityMap: Record<string, KnownEntityItem>,
    node: Node
): HTMLElement | null {
    let result: HTMLElement | null = null;

    if (isNodeOfType(node, 'ELEMENT_NODE')) {
        if (isEntityElement(node)) {
            const format = parseEntityFormat(node);

            result = getEntityWrapperForReuse(entityMap, format.id);
        } else if (isBlockEntityContainer(node)) {
            result = tryGetEntityFromContainer(node, entityMap);
        }
    }

    return result;
}

function tryGetEntityFromContainer(
    element: HTMLElement,
    entityMap: Record<string, KnownEntityItem>
): HTMLElement | null {
    for (let node = element.firstChild; node; node = node.nextSibling) {
        if (isEntityElement(node) && isNodeOfType(node, 'ELEMENT_NODE')) {
            const format = parseEntityFormat(node);
            const parent = getEntityWrapperForReuse(entityMap, format.id)?.parentElement;

            return isNodeOfType(parent, 'ELEMENT_NODE') && isBlockEntityContainer(parent)
                ? parent
                : null;
        }
    }

    return null;
}

function getEntityWrapperForReuse(
    entityMap: Record<string, KnownEntityItem>,
    entityId: string | undefined
): HTMLElement | null {
    const entry = entityId ? entityMap[entityId] : undefined;

    return entry?.canPersist ? entry.element : null;
}
