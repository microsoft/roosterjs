import setListMarker from './setListMarker';
import { BulletListType } from 'roosterjs-editor-types';

/**
 * Set the marker of a bullet list
 * @param li
 * @param listStyleType
 */
export default function setBulletListMarkers(li: HTMLLIElement, listStyleType: BulletListType) {
    const bullet = bulletListStyle[listStyleType];
    setListMarker(li, bullet);
}

const bulletListStyle: Record<string, string> = {
    [BulletListType.Disc]: 'disc',
    [BulletListType.Square]: 'square',
    [BulletListType.Hyphen]: "'—'",
    [BulletListType.Dash]: "'-'",
    [BulletListType.LongArrow]: "'→'",
    [BulletListType.ShortArrow]: "'✏'",
    [BulletListType.UnfilledArrow]: "'⇨'",
};
