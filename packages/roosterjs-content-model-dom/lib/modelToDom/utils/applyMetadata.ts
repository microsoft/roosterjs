import { retrieveMetadataCopy } from '../../modelApi/metadata/updateMetadata';
import type {
    ContentModelFormatBase,
    MetadataApplier,
    ModelToDomContext,
    ReadonlyContentModelWithDataset,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function applyMetadata<TMetadata, TFormat extends ContentModelFormatBase>(
    model: ReadonlyContentModelWithDataset<TMetadata>,
    applier: MetadataApplier<TMetadata, TFormat> | undefined,
    format: TFormat,
    context: ModelToDomContext
) {
    if (applier) {
        const metadata = retrieveMetadataCopy(model, applier.metadataDefinition);

        if (metadata) {
            applier.applierFunction(metadata, format, context);
        }
    }
}
