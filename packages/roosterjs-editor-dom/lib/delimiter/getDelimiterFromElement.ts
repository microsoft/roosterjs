import { Delimiter, DelimiterType } from 'roosterjs-editor-types';
import { DelimiterClasses } from './DelimiterClasses';

export default function getDelimiterFromElement(
    element: HTMLElement | Element | null | undefined
): Delimiter | null {
    let isDelimiter: boolean | undefined;
    let type: DelimiterType | undefined;
    let id: string = '';

    if (!element) {
        return null;
    }
    element?.className?.split(' ').forEach(name => {
        if (name == DelimiterClasses.DELIMITER) {
            isDelimiter = true;
        } else if (name.indexOf(DelimiterClasses.DELIMITER_ID_PREFIX) == 0) {
            id = name.substr(DelimiterClasses.DELIMITER_ID_PREFIX.length);
        } else if (name.indexOf(DelimiterClasses.DELIMITER_TYPE_PREFIX) == 0) {
            const typeFromClass = name.substr(DelimiterClasses.DELIMITER_TYPE_PREFIX.length);
            if (typeFromClass === DelimiterType.After || typeFromClass === DelimiterType.Before) {
                type = typeFromClass;
            }
        }
    });

    return isDelimiter && type ? { type, id, element } : null;
}
