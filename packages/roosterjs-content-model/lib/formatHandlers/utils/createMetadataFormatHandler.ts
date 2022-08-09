import { Definition } from 'roosterjs-editor-types';
import { FormatHandler } from '../FormatHandler';
import { getMetadata, getObjectKeys, removeMetadata, setMetadata } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export function createMetadataFormatHandler<T extends Object>(
    definition: Definition<T>,
    onApply?: (format: T) => T
): FormatHandler<T> {
    return {
        parse: (format, element) => {
            const metadata = getMetadata(element, definition);

            if (metadata) {
                Object.assign(format, metadata);
            }
        },
        apply: (format, element) => {
            const metadata = onApply?.(format) || format;

            if (
                metadata &&
                !getObjectKeys(metadata).every(key => typeof metadata[key] === 'undefined')
            ) {
                setMetadata(element, metadata, definition);
            } else {
                removeMetadata(element);
            }
        },
    };
}
