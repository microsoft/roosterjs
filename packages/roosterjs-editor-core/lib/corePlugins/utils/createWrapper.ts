import { Wrapper } from 'roosterjs-editor-types';

/**
 * @internal Create a wrapper
 * @param value The value to wrap
 */
export default function createWrapper<T>(value: T): Wrapper<T> {
    return {
        value,
    };
}
