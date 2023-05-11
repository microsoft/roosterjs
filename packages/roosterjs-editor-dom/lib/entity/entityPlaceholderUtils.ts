import getEntityFromElement from './getEntityFromElement';
import getEntitySelector from './getEntitySelector';
import safeInstanceOf from '../utils/safeInstanceOf';
import { Entity, EntityClasses, NodeType } from 'roosterjs-editor-types';

const EntityPlaceholderSelector = '.' + EntityClasses.ENTITY_PLACEHOLDER;

/**
 * Create a placeholder comment node for entity
 * @param entity The entity to create placeholder from
 * @returns A placeholder comment node as
 */
export function createEntityPlaceholder(entity: Entity): HTMLElement {
    const placeholder = entity.wrapper.ownerDocument.createElement('span');
    placeholder.id = entity.id;
    placeholder.className = EntityClasses.ENTITY_PLACEHOLDER;

    return placeholder;
}

/**
 * Move content from a container into a new Document fragment, and try keep entities to be reusable by creating placeholder
 * for them in the document fragment.
 * If an entity is directly under root container, the whole entity can be reused and no need to move it at all.
 * If an entity is not directly under root container, it is still reusable, but it may need some movement.
 * In any case, entities will be replaced with a placeholder in the target document fragment.
 * We will use an entity map (the "entities" parameter) to save the map from entity id to its wrapper element.
 * @param root The root element
 * @param entities A map from entity id to entity wrapper element
 * @returns A new document fragment contains all the content and entity placeholders
 */
export function moveContentWithEntityPlaceholders(
    root: HTMLDivElement,
    entities: Record<string, HTMLElement>,
    clone?: boolean
) {
    const entitySelector = getEntitySelector();
    const fragment = root.ownerDocument.createDocumentFragment();
    let next: Node | null = null;

    for (let child: Node | null = root.firstChild; child; child = next) {
        let entity: Entity | null;
        let nodeToAppend = child;

        next = child.nextSibling;

        if (safeInstanceOf(child, 'HTMLElement')) {
            if ((entity = getEntityFromElement(child))) {
                nodeToAppend = getPlaceholder(entity, entities);
            } else {
                child.querySelectorAll<HTMLElement>(entitySelector).forEach(wrapper => {
                    if ((entity = getEntityFromElement(wrapper))) {
                        const placeholder = getPlaceholder(entity, entities);

                        wrapper.parentNode?.replaceChild(placeholder, wrapper);
                    }
                });

                if (clone) {
                    nodeToAppend = child.cloneNode(true /*deep*/);
                }
            }
        } else if (clone) {
            nodeToAppend = child.cloneNode(true /*deep*/);
        }

        fragment.appendChild(nodeToAppend);
    }

    fragment.normalize();

    return fragment;
}

/**
 * Restore HTML content from a document fragment that may contain entity placeholders.
 * @param source Source document fragment that contains HTML content and entity placeholders
 * @param target Target container, usually to be editor root container
 * @param entities A map from entity id to entity wrapper, used for reusing existing DOM structure for entity
 * @param insertClonedNode When pass true, merge with a cloned copy of the nodes from source fragment rather than the nodes themselves @default false
 */
export function restoreContentWithEntityPlaceholder(
    source: ParentNode,
    target: HTMLElement,
    entities: Record<string, HTMLElement> | null,
    insertClonedNode?: boolean
) {
    let anchor = target.firstChild;
    entities = entities || {};

    for (let current = source.firstChild; current; ) {
        let wrapper: HTMLElement | null = null;
        const next = current.nextSibling;
        const id = tryGetIdFromEntityPlaceholder(current);

        if (id && (wrapper = entities[(<HTMLElement>current).id])) {
            anchor = removeUntil(anchor, wrapper);

            if (anchor) {
                anchor = anchor.nextSibling;
            } else {
                target.appendChild(wrapper);
            }
        } else {
            const nodeToInsert = insertClonedNode ? current.cloneNode(true /*deep*/) : current;
            target.insertBefore(nodeToInsert, anchor);

            if (safeInstanceOf(nodeToInsert, 'HTMLElement')) {
                nodeToInsert.querySelectorAll(EntityPlaceholderSelector).forEach(placeholder => {
                    wrapper = entities![placeholder.id];

                    if (wrapper) {
                        placeholder.parentNode?.replaceChild(wrapper, placeholder);
                    }
                });
            }
        }

        current = next;
    }

    removeUntil(anchor);
}

function removeUntil(anchor: ChildNode | null, nodeToStop?: HTMLElement) {
    while (anchor && (!nodeToStop || anchor != nodeToStop)) {
        const nodeToRemove = anchor;
        anchor = anchor.nextSibling;
        nodeToRemove.parentNode?.removeChild(nodeToRemove);
    }
    return anchor;
}

function tryGetIdFromEntityPlaceholder(node: Node): string | null {
    return node.nodeType == NodeType.Element &&
        (<HTMLElement>node).className == EntityClasses.ENTITY_PLACEHOLDER
        ? (<HTMLElement>node).id
        : null;
}

function getPlaceholder(entity: Entity, entities: Record<string, HTMLElement>) {
    const placeholder = createEntityPlaceholder(entity);

    entities[entity.id] = entity.wrapper;

    return placeholder;
}
