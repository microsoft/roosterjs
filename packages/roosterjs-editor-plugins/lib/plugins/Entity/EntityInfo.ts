import getEntities from './getEntities';
import { Editor } from 'roosterjs-editor-core';

const ENTITY_ID_REGEX = /_\d{1,8}$/;
const ENTITY_INFO_NAME = '_Entity';
const ENTITY_TYPE_PREFIX = '_EType_';
const ENTITY_ID_PREFIX = '_EId_';
const ENTITY_READONLY_PREFIX = '_EReadonly_';

const ENTITY_CSS_REGEX = '^' + ENTITY_INFO_NAME + '$';
const ENTITY_ID_CSS_REGEX = '^' + ENTITY_ID_PREFIX;
const ENTITY_TYPE_CSS_REGEX = '^' + ENTITY_TYPE_PREFIX;
const ENTITY_READONLY_CSS_REGEX = '^' + ENTITY_READONLY_PREFIX;

export const ALLOWED_CSS_CLASSES = [
    ENTITY_CSS_REGEX,
    ENTITY_ID_CSS_REGEX,
    ENTITY_TYPE_CSS_REGEX,
    ENTITY_READONLY_CSS_REGEX,
];

/**
 * @internal Serialize entity info into a CSS class list string
 * @param editor The editor which contains the entity
 * @param type Type of the entity
 * @param isReadonly Whether the entity is readonly
 * @param originalId (Optional) Existing id of the entity. If this id already exists in the editor, it will be replaced
 * by a new one
 * @param knownIds (Optional) All known entity ids inside this editor. This is a performance optimization when this function
 * will be called multiple times
 */
export function serializeEntityInfo(
    editor: Editor,
    type: string,
    isReadonly: boolean,
    originalId?: string,
    knownIds: string[] = getAllEntityIds(editor)
): string {
    const id = createEntityId(originalId || type, knownIds);
    return `${ENTITY_INFO_NAME} ${ENTITY_TYPE_PREFIX}${type} ${ENTITY_ID_PREFIX}${id} ${ENTITY_READONLY_PREFIX}${
        isReadonly ? '1' : '0'
    }`;
}

/**
 * @internal Deserialze entity info string to entity info (type, id, isReadonly)
 * @param entityInfo The entity info string generated from serializeEntityInfo()
 */
export function deserialzeEntityInfo(
    entityInfo: string
): {
    type: string;
    id: string;
    isReadonly: boolean;
} {
    let isEntity = false;
    let type: string;
    let id = '';
    let isReadonly = false;

    if (entityInfo) {
        entityInfo.split(' ').forEach(name => {
            if (name == ENTITY_INFO_NAME) {
                isEntity = true;
            } else if (name.indexOf(ENTITY_TYPE_PREFIX) == 0) {
                type = name.substr(ENTITY_TYPE_PREFIX.length);
            } else if (name.indexOf(ENTITY_ID_PREFIX) == 0) {
                id = name.substr(ENTITY_ID_PREFIX.length);
            } else if (name.indexOf(ENTITY_READONLY_PREFIX) == 0) {
                isReadonly = name.substr(ENTITY_READONLY_PREFIX.length) == '1';
            }
        });
    }

    return isEntity && type
        ? {
              type,
              id,
              isReadonly,
          }
        : null;
}

/**
 * @internal Get all known entity ids from an editor
 * @param editor The editor to get entity ids from
 */
export function getAllEntityIds(editor: Editor): string[] {
    return getEntities(editor).map(e => e.id);
}

/**
 * @internal Get a selector string for specified entity type and id
 * @param type (Optional) Type of entity
 * @param id (Optional) Id of entity
 */
export function getEntitySelector(type?: string, id?: string): string {
    const typeSelector = type ? `.${ENTITY_TYPE_PREFIX}${type}` : '';
    const idSelector = id ? `.${ENTITY_ID_PREFIX}${id}` : '';
    return '.' + ENTITY_INFO_NAME + typeSelector + idSelector;
}

function createEntityId(existingIdOrType: string, knownIds: string[]) {
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
