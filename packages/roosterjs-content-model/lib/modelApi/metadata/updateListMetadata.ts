import { BulletListType, NumberingListType } from 'roosterjs-editor-types';
import { ContentModelWithDataset } from '../../publicTypes/format/ContentModelWithDataset';
import { createNumberDefinition, createObjectDefinition } from 'roosterjs-editor-dom';
import { ListMetadataFormat } from '../../publicTypes/format/formatParts/ListMetadataFormat';
import { updateMetadata } from './updateMetadata';

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
 * @internal
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
