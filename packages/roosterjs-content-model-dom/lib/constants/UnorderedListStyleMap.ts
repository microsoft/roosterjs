import { BulletListType } from './BulletListType';

/**
 * Style map for unordered list
 */
export const UnorderedListStyleMap: Record<number, string> = {
    [BulletListType.Disc]: 'disc',
    [BulletListType.Square]: '"∎ "',
    [BulletListType.Circle]: 'circle',
    [BulletListType.Dash]: '"- "',
    [BulletListType.LongArrow]: '"➔ "',
    [BulletListType.DoubleLongArrow]: '"➔ "',
    [BulletListType.ShortArrow]: '"➢ "',
    [BulletListType.UnfilledArrow]: '"➪ "',
    [BulletListType.Hyphen]: '"— "',
};
