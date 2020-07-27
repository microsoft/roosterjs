import { Entity, EntityClasses } from 'roosterjs-editor-types';

/**
 * Get Entity object from an entity root element
 * @param element The entity root element. If this element is not an entity root element,
 * it will return null
 */
export default function getEntityFromElement(contentNode: HTMLElement): Entity {
    let isEntity = false;
    let type: string;
    let id = '';
    let isReadonly = false;

    contentNode?.className?.split(' ').forEach(name => {
        if (name == EntityClasses.ENTITY_INFO_NAME) {
            isEntity = true;
        } else if (name.indexOf(EntityClasses.ENTITY_TYPE_PREFIX) == 0) {
            type = name.substr(EntityClasses.ENTITY_TYPE_PREFIX.length);
        } else if (name.indexOf(EntityClasses.ENTITY_ID_PREFIX) == 0) {
            id = name.substr(EntityClasses.ENTITY_ID_PREFIX.length);
        } else if (name.indexOf(EntityClasses.ENTITY_READONLY_PREFIX) == 0) {
            isReadonly = name.substr(EntityClasses.ENTITY_READONLY_PREFIX.length) == '1';
        }
    });

    return isEntity
        ? {
              contentNode,
              id,
              type,
              isReadonly,
          }
        : null;
}
