import { DELIMITER_AFTER, DELIMITER_BEFORE, DelimiterType } from './constants';
import { Entity } from 'roosterjs-editor-types';
import { getEntityFromElement } from 'roosterjs-editor-dom';

export function isDelimiter(
    ent: Element | Entity | null | undefined
): [DelimiterType, Entity] | null {
    if (!ent) {
        return null;
    }
    let entity: Entity | null = (<Entity>ent).wrapper
        ? <Entity>ent
        : getEntityFromElement(<HTMLElement>ent);
    if (entity) {
        const id = entity.type;
        if (id.indexOf(DELIMITER_AFTER) > -1) {
            return [DelimiterType.After, entity];
        }
        if (id.indexOf(DELIMITER_BEFORE) > -1) {
            return [DelimiterType.Before, entity];
        }
    }
    return null;
}
