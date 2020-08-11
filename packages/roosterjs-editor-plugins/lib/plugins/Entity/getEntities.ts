import getEntityFromElement from './getEntityFromElement';
import { Editor } from 'roosterjs-editor-core';
import { Entity } from 'roosterjs-editor-types';
import { getEntitySelector } from './EntityInfo';

/**
 * Get all entities with given entity type and id from an editor
 * @param editor The editor to get entity from
 * @param type (Optional) Type of the entity. If not specified, it will return all entities from this editor
 * @param id (Optional) Id of the entity. If not specified, it will return all entities of the given type
 */
export default function getEntities(editor: Editor, type?: string, id?: string): Entity[] {
    const selector = getEntitySelector(type, id);
    const nodes = editor.queryElements(selector);
    const allEntities = nodes.map(node => getEntityFromElement(node));

    return allEntities.filter(e => !!e);
}
