import { ListType } from 'roosterjs-editor-types';

function isABulletList(textBeforeCursor: string) {
    const hasTriggers = ['*', '-', '>'].indexOf(textBeforeCursor[0]) > -1;
    const REGEX: RegExp = /^(.*?)=>|^(.*?)->|^(.*?)-->|^(.*?)=>|^(.*?)--/;
    return hasTriggers || REGEX.test(textBeforeCursor);
}

function isANumberingList(textBeforeCursor: string) {
    const REGEX: RegExp = /^([1,a, i,A,I]\.|[1,a, i,A,I]\)|[1,a, i,A,I]\-|)$/;
    return REGEX.test(textBeforeCursor.replace(/\s/g, ''));
}

/**
 * @internal
 * @param textBeforeCursor The trigger character
 * @returns If the list is ordered or unordered
 */
export function getListType(textBeforeCursor: string): ListType {
    if (isABulletList(textBeforeCursor)) {
        return ListType.Unordered;
    } else if (isANumberingList(textBeforeCursor)) {
        return ListType.Ordered;
    }
}
