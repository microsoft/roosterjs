import { deserialzeEntityInfo } from './EntityInfo';
import { Entity } from 'roosterjs-editor-types';

/**
 * Get Entity object from an entity root element
 * @param element The entity root element. If this element is not an entity root element,
 * it will return null
 */
export default function getEntityFromElement(element: HTMLElement): Entity {
    const entityInfo = deserialzeEntityInfo(element?.className);

    return entityInfo
        ? {
              contentNode: element,
              ...entityInfo,
          }
        : null;
}
