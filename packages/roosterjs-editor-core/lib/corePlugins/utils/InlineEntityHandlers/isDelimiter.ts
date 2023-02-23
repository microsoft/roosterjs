import { DELIMITER_AFTER, DELIMITER_BEFORE, DelimiterType } from './constants';

export function isDelimiter(element: Element | null | undefined): DelimiterType | null {
    if (!element) {
        return null;
    }

    if (element.id.indexOf(DELIMITER_AFTER) > -1) {
        return DelimiterType.After;
    }
    if (element.id.indexOf(DELIMITER_BEFORE) > -1) {
        return DelimiterType.Before;
    }
    return null;
}
