import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { createNumberDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { updateMetadata } from './updateMetadata';
import type { ContentModelWithDataset, ListMetadataFormat } from 'roosterjs-content-model-types';

const ListStyleDefinitionMetadata = createObjectDefinition<ListMetadataFormat>(
    {
        orderedStyleType: createNumberDefinition(
            true /** isOptional */,
            undefined /** value **/,
            NumberingListType.Min,
            NumberingListType.Max
        ),
        unorderedStyleType: createNumberDefinition(
            true /** isOptional */,
            undefined /** value **/,
            BulletListType.Min,
            BulletListType.Max
        ),
    },
    true /** isOptional */,
    true /** allowNull */
);

/**
 * Update list metadata with a callback
 * @param list The list Content Model (metadata holder)
 * @param callback The callback function used for updating metadata
 */
export function updateListMetadata(
    list: ContentModelWithDataset<ListMetadataFormat>,
    callback?: (format: ListMetadataFormat | null) => ListMetadataFormat | null
): ListMetadataFormat | null {
    return updateMetadata(list, callback, ListStyleDefinitionMetadata);
}
