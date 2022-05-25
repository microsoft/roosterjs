import { ListType } from 'roosterjs-editor-types';

function isABulletList(textBeforeCursor: string) {
    const hasTriggers = ['*', '-', '>'].indexOf(textBeforeCursor[0]) > -1;
    const REGEX: RegExp = /^(.*?)=>|^(.*?)->|^(.*?)-->|^(.*?)=>|^(.*?)--/;
    return hasTriggers || REGEX.test(textBeforeCursor);
}

function isANumberingList(textBeforeCursor: string) {
    const REGEX: RegExp = /^([1-9,a-z, i,A-Z,I]{1,2}\.|[1-9,a-z, i,A-Z,I]{1,2}\)|[1-9,a-z, i,A-Z,I]{1,2}\-|\([1-9,a-z, i,A-Z,I]{1,2}\))$/;
    return REGEX.test(textBeforeCursor.replace(/\s/g, ''));
}

/**
 * @internal
 * @param textBeforeCursor The trigger character
 * @returns If the list is ordered or unordered
 */
export default function getListType(textBeforeCursor: string): ListType {
    if (isABulletList(textBeforeCursor)) {
        return ListType.Unordered;
    } else if (isANumberingList(textBeforeCursor)) {
        return ListType.Ordered;
    }
}
