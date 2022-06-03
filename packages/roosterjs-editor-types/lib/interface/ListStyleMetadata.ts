import { BulletListType } from '../enum/BulletListType';
import { NumberingListType } from '../enum/NumberingListType';

/**
 * Represents the metadata of the style of a list element
 */
export default interface ListStyleMetadata {
    orderedStyleType?: NumberingListType;
    unOrderedStyleType?: BulletListType;
}
