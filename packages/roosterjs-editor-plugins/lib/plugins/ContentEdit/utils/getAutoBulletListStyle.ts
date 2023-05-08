import { BulletListType } from 'roosterjs-editor-types';

const bulletListType: Record<string, number> = {
    '*': BulletListType.Disc,
    '-': BulletListType.Dash,
    '--': BulletListType.Square,
    '->': BulletListType.LongArrow,
    '-->': BulletListType.DoubleLongArrow,
    '=>': BulletListType.UnfilledArrow,
    '>': BulletListType.ShortArrow,
    '—': BulletListType.Hyphen,
};

const identifyBulletListType = (bullet: string): BulletListType | null => {
    return bulletListType[bullet] || null;
};

/**
 * @internal
 * @param textBeforeCursor The trigger character
 * @returns The style of a bullet list triggered by a string
 */
export default function getAutoBulletListStyle(textBeforeCursor: string): BulletListType | null {
    const trigger = textBeforeCursor.trim();
    const bulletType = identifyBulletListType(trigger);
    return bulletType;
}
