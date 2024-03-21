import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    TypeOfBlockGroup,
} from 'roosterjs-content-model-types';

/**
 * Check if the given content model block or block group is of the expected block group type
 * @param input The object to check
 * @param type The expected type
 */
export function isBlockGroupOfType<T extends ContentModelBlockGroup>(
    input: ContentModelBlock | ContentModelBlockGroup | null | undefined,
    type: TypeOfBlockGroup<T>
): input is T {
    const item = <T | null | undefined>input;

    return item?.blockGroupType == type;
}
