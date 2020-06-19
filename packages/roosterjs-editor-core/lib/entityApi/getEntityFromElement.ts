import { Entity } from 'roosterjs-editor-types';
import { EntityClass, IdPrefix, ReadonlyPrefix, TypePrefix } from './EntityConstants';

export default function getEntityFromElement(element: HTMLElement): Entity {
    const classNames = (element && element.className.split(' ')) || [];

    let isEntity = false;
    let type: string;
    let id = '';
    let isReadonly = false;

    classNames.forEach(name => {
        if (name == EntityClass) {
            isEntity = true;
        } else if (name.indexOf(TypePrefix) == 0) {
            type = name.substr(TypePrefix.length);
        } else if (name.indexOf(IdPrefix) == 0) {
            id = name.substr(IdPrefix.length);
        } else if (name.indexOf(ReadonlyPrefix) == 0) {
            isReadonly = name.substr(ReadonlyPrefix.length) == '1';
        }
    });

    return isEntity && type
        ? {
              type,
              id,
              isReadonly,
              contentNode: element,
          }
        : null;
}
