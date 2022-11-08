import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { TypeOfBlockGroup } from './getOperationalBlocks';

/**
 * @internal
 */
export function isBlockGroupOfType<T extends ContentModelBlockGroup>(
    input: Object | null | undefined,
    type: TypeOfBlockGroup<T>
): input is T {
    const item = <T | null | undefined>input;

    return item?.blockGroupType == type;
}
