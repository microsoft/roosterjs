import { EntityPlaceholderPair } from '../publicTypes/context/ModelToDomEntityContext';
import { isNodeAfter, moveChildNodes } from 'roosterjs-editor-dom';

/**
 * Default implementation of merging DOM tree generated from Content Model in to existing container
 * @param source Source document fragment that is generated from Content Model
 * @param target Target container, usually to be editor root container
 * @param entityPairs An array of entity wrapper - placeholder pairs, used for reuse existing DOM structure for entity
 */
export default function mergeFragmentWithEntity(
    source: DocumentFragment,
    target: HTMLElement,
    entityPairs: EntityPlaceholderPair[]
) {
    const { reusableWrappers, placeholders } = preprocessEntitiesFromContentModel(
        entityPairs,
        source,
        target
    );

    if (reusableWrappers.length == 0) {
        moveChildNodes(target);
        target.appendChild(source);
    } else {
        const nodesToRemove: Node[] = [];

        for (let child = target.firstChild; child; child = child.nextSibling) {
            if (reusableWrappers.indexOf(child) < 0) {
                nodesToRemove.push(child);
            }
        }

        nodesToRemove.forEach(node => target.removeChild(node));

        for (let i = 0; i <= reusableWrappers.length; i++) {
            while (source.firstChild && source.firstChild != placeholders[i]) {
                target.insertBefore(source.firstChild, reusableWrappers[i] || null);
            }

            if (source.firstChild && source.firstChild == placeholders[i]) {
                source.removeChild(placeholders[i]);
            }
        }
    }
}

/**
 * @internal
 */
export function preprocessEntitiesFromContentModel(
    entityPairs: EntityPlaceholderPair[],
    source?: DocumentFragment,
    target?: HTMLElement
): { reusableWrappers: Node[]; placeholders: Node[] } {
    const reusableWrappers: Node[] = [];
    const placeholders: Node[] = [];

    entityPairs.forEach(pair => {
        const { entityWrapper, placeholder } = pair;
        const parent = placeholder.parentNode;
        const lastWrapper = reusableWrappers[reusableWrappers.length - 1];
        const lastPlaceholder = placeholders[placeholders.length - 1];

        if (
            source &&
            target &&
            parent == source &&
            entityWrapper.parentNode == target &&
            (!lastWrapper || isNodeAfter(entityWrapper, lastWrapper)) &&
            (!lastPlaceholder || isNodeAfter(placeholder, lastPlaceholder))
        ) {
            reusableWrappers.push(entityWrapper);
            placeholders.push(placeholder);
        } else if (parent) {
            parent.replaceChild(pair.entityWrapper, pair.placeholder);
        }
    });
    return { reusableWrappers, placeholders };
}
