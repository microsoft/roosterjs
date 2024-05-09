import { internalConvertToMutableType } from '../creators/internalConvertToMutableType';
import type {
    MutableType,
    ReadonlyContentModelBlock,
    ReadonlyContentModelListLevel,
    ReadonlyContentModelTableRow,
} from 'roosterjs-content-model-types';

/**
 * Check if the given block is of its mutable type
 * @param block The block to check
 * @returns True if block is mutable, otherwise false
 */
export function isMutableBlock<
    T extends
        | ReadonlyContentModelBlock
        | ReadonlyContentModelListLevel
        | ReadonlyContentModelTableRow
>(block: T | MutableType<T>): block is MutableType<T> {
    const mutableBlock = internalConvertToMutableType(block);

    return !mutableBlock.cachedElement;
}
