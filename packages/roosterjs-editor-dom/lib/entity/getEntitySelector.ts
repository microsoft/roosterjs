import { EntityClasses } from 'roosterjs-editor-types';

/**
 * Get a selector string for specified entity type and id
 * @param type (Optional) Type of entity
 * @param id (Optional) Id of entity
 */
export default function getEntitySelector(type?: string, id?: string): string {
    const typeSelector = type ? `.${EntityClasses.ENTITY_TYPE_PREFIX}${type}` : '';
    const idSelector = id ? `.${EntityClasses.ENTITY_ID_PREFIX}${id}` : '';
    return '.' + EntityClasses.ENTITY_INFO_NAME + typeSelector + idSelector;
}
