import { BulletListType } from 'roosterjs-editor-types';
import type { CompatibleBulletListType } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 * Set the marker of a bullet list
 * @param li
 * @param listStyleType
 */
export default function setBulletListMarkers(
    li: HTMLLIElement,
    listStyleType: BulletListType | CompatibleBulletListType
) {
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
    [BulletListType.DoubleLongArrow]: '→ ',
    [BulletListType.ShortArrow]: '➢ ',
    [BulletListType.UnfilledArrow]: '➪ ',
    [BulletListType.Hyphen]: '— ',
};
