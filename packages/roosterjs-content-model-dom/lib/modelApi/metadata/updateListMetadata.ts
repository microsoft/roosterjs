import { BulletListType } from '../../constants/BulletListType';
import { NumberingListType } from '../../constants/NumberingListType';
import { updateMetadata } from './updateMetadata';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
} from './definitionCreators';
import type {
    ContentModelWithDataset,
    ListMetadataFormat,
    ObjectDefinition,
} from 'roosterjs-content-model-types';

/**
 * Metadata definition for List
 */
export const ListMetadataDefinition: ObjectDefinition<ListMetadataFormat> = createObjectDefinition<
    ListMetadataFormat
>(
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
        applyListStyleFromLevel: createBooleanDefinition(true /*isOptional*/),
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
    return updateMetadata(list, callback, ListMetadataDefinition);
}
