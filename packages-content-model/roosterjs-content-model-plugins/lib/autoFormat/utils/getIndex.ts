import { convertAlphaToDecimals } from './convertAlphaToDecimals';

/**
 * @internal
 */
export function getIndex(listIndex: string) {
    const index = listIndex.replace(/[^a-zA-Z0-9 ]/g, '');
    const indexNumber = parseInt(index);
    return !isNaN(indexNumber) ? indexNumber : convertAlphaToDecimals(index);
}
