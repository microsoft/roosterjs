import { ListType } from 'roosterjs-editor-types/lib';

function isABulletList(textBeforeCursor: string) {
    const hasTriggers = ['*', '-', '>'].indexOf(textBeforeCursor[0]) > -1;
    const REGEX: RegExp = /^(.*?)=>|^(.*?)->|^(.*?)-->|^(.*?)=>|^(.*?)--/;
    return hasTriggers || REGEX.test(textBeforeCursor);
}

function isANumberingList(textBeforeCursor: string) {
    const REGEX: RegExp = /^([1,a, i,A,I]\.|[1,a, i,A,I]\)|[1,a, i,A,I]\-|)$/;
    return REGEX.test(textBeforeCursor.replace(/\s/g, ''));
}

export function getListType(textBeforeCursor: string): ListType {
    if (isABulletList(textBeforeCursor)) {
        return ListType.Unordered;
    } else if (isANumberingList(textBeforeCursor)) {
        return ListType.Ordered;
    }
}
