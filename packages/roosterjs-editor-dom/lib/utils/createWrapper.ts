import { Wrapper } from 'roosterjs-editor-types';

/**
 * Create a wrapper of a value
 * @param value The value to wrap
 */
export default function createWrapper<T>(value: T): Wrapper<T> {
    return {
        value,
    };
}
