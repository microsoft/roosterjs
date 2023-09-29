import { updateMetadata } from './updateMetadata';
import type { Definition } from 'roosterjs-editor-types';
import type {
    ContentModelFormatBase,
    MetadataApplier,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createMetadataApplier<TMetadata, TFormat extends ContentModelFormatBase>(
    callback: (metadata: TMetadata | null, format: TFormat, context: ModelToDomContext) => void,
    definition?: Definition<TMetadata>
): MetadataApplier<TMetadata, TFormat> {
    return (model, format, context) => {
        updateMetadata(
            model,
            metadata => {
                callback(metadata, format, context);

                return metadata;
            },
            definition
        );
    };
}
