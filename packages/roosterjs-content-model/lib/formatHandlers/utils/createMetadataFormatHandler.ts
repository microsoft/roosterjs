import { Definition } from 'roosterjs-editor-types';
import { FormatHandler } from '../FormatHandler';
import { getMetadata, removeMetadata, setMetadata } from 'roosterjs-editor-dom';
import { MetadataFormat } from '../../publicTypes/format/formatParts/MetadataFormat';

/**
 * @internal
 */
export function createMetadataFormatHandler<T>(
    definition: Definition<T>
): FormatHandler<MetadataFormat<T>> {
    return {
        parse: (format, element) => {
            const metadata = getMetadata(element, definition);

            if (metadata) {
                format.metadata = metadata;
            }
        },
        apply: (format, element) => {
            if (format.metadata) {
                setMetadata(element, format.metadata, definition);
            } else {
                removeMetadata(element);
            }
        },
    };
}
