import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { OperationalBlocks, TypeOfBlockGroup } from './getOperationalBlocks';

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

/**
 * @internal
 */
export function areAllOperationalBlocksOfGroupType<
    SourceType extends ContentModelBlockGroup,
    ResultType extends SourceType
>(
    blocks: OperationalBlocks<SourceType>[],
    type: TypeOfBlockGroup<ResultType>
): blocks is ResultType[] {
    return blocks.every(block => isBlockGroupOfType<ResultType>(block, type));
}
