import Editor from '../editor/Editor';
import getEntities from './getEntities';
import { EntityClass, IdPrefix, ReadonlyPrefix, TypePrefix } from './EntityConstants';

const ENTITY_ID_REGEX = /_\d{1,8}$/;

/**
 * @internal
 * @param type
 * @param id
 * @param isReadonly
 */
export default function createEntityClassNames(
    editor: Editor,
    type: string,
    isReadonly: boolean,
    originalId?: string,
    knownIds?: string[]
) {
    const id = createEntityId(editor, originalId || type, knownIds);
    return `${EntityClass} ${TypePrefix}${type} ${IdPrefix}${id} ${ReadonlyPrefix}${
        isReadonly ? '1' : '0'
    }`;
}

/**
 * @internal
 * @param editor
 */
export function getAllEntityIds(editor: Editor): string[] {
    return getEntities(editor).map(e => e.id);
}

function createEntityId(
    editor: Editor,
    existingIdOrType: string,
    knownIds: string[] = getAllEntityIds(editor)
) {
    const match = ENTITY_ID_REGEX.exec(existingIdOrType);
    const baseId = match
        ? existingIdOrType.substr(0, existingIdOrType.length - match[0].length)
        : existingIdOrType;
    let newId = '';

    for (let num = (match && parseInt(match[1])) || 0; ; num++) {
        newId = `${baseId}_${num}`;

        if (knownIds.indexOf(newId) < 0) {
            knownIds.push(newId);
            break;
        }
    }

    return newId;
}
