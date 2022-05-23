import { BulletListType } from 'roosterjs-editor-types';

/**
 * Set the marker of a bullet list
 * @param li
 * @param listStyleType
 */
export default function setBulletListMarkers(li: HTMLLIElement, listStyleType: BulletListType) {
    const marker = bulletListStyle[listStyleType];
    const isDiscOrSquare =
        listStyleType === BulletListType.Disc || listStyleType === BulletListType.Square;
    li.style.listStyleType = isDiscOrSquare ? marker : `"${marker}"`;
}

const bulletListStyle: Record<string, string> = {
    [BulletListType.Disc]: 'disc',
    [BulletListType.Square]: 'square',
    [BulletListType.Dash]: '- ',
    [BulletListType.LongArrow]: '→ ',
};
