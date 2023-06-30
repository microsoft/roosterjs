import { ContentModelBlock, ContentModelBlockGroup } from 'roosterjs-content-model-types';
import { TypeOfBlockGroup } from './getClosestAncestorBlockGroupIndex';

/**
 * @internal
 */
export function isBlockGroupOfType<T extends ContentModelBlockGroup>(
    input: ContentModelBlock | ContentModelBlockGroup | null | undefined,
    type: TypeOfBlockGroup<T>
): input is T {
    const item = <T | null | undefined>input;

    return item?.blockGroupType == type;
}
