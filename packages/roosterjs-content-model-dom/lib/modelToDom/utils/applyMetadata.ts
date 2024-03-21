import { updateMetadata } from '../../modelApi/metadata/updateMetadata';
import type {
    ContentModelFormatBase,
    ContentModelWithDataset,
    MetadataApplier,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function applyMetadata<TMetadata, TFormat extends ContentModelFormatBase>(
    model: ContentModelWithDataset<TMetadata>,
    applier: MetadataApplier<TMetadata, TFormat> | undefined,
    format: TFormat,
    context: ModelToDomContext
) {
    if (applier) {
        updateMetadata(
            model,
            metadata => {
                applier.applierFunction(metadata, format, context);
                return metadata;
            },
            applier.metadataDefinition
        );
    }
}
