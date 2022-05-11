import { BulletListType } from 'roosterjs-editor-types/lib';

/**
 * Set the marker of a bullet list
 * @param rootList
 * @param listStyleType
 */
export default function setBulletListMarkers(
    rootList: HTMLUListElement,
    listStyleType: BulletListType
) {
    const marker = bulletListStyle[listStyleType];
    console.log(rootList);
    rootList.style.listStyleType = marker;
}

const bulletListStyle: Record<string, string> = {
    [BulletListType.Disc]: 'disc',
    [BulletListType.Square]: 'square',
    [BulletListType.Hyphen]: "'—'",
    [BulletListType.Dash]: "'-'",
    [BulletListType.LongArrow]: "'→'",
    [BulletListType.ShortArrow]: '',
    [BulletListType.UnfilledArrow]: "'⇨'",
};
