import Editor from '../editor/Editor';
import getEntityFromElement from './getEntityFromElement';
import { Entity } from 'roosterjs-editor-types';
import { EntitySelector, IdPrefix, TypePrefix } from './EntityConstants';

export default function getEntities(editor: Editor, type?: string, id?: string): Entity[] {
    const typeSelector = type ? `.${TypePrefix}${type}` : '';
    const idSelector = id ? `.${IdPrefix}${id}` : '';
    const selector = EntitySelector + typeSelector + idSelector;
    const nodes = editor.queryElements(selector);
    const allEntities = nodes.map(node => getEntityFromElement(node));

    return allEntities.filter(e => !!e);
}
