import { Entity } from 'roosterjs-editor-types';
import getEntityFromElement from './getEntityFromElement';
import getEntitySelector from './getEntitySelector';

/**
 * Queries for all available entities under [root] and verifies if [element] is contained in any of them
 * @param element Possible child of entity element
 * @param root HTML to query for entities
 * @returns An entity, if found. Or null
 */
export default function findParentEntity(element: HTMLElement, root: HTMLElement): Entity | null {
    for (const node of Array.from(root.querySelectorAll(getEntitySelector()))) {
        if (node.contains(element)) {
            return getEntityFromElement(<HTMLElement>node);
        }
    }
    return null;
}
