import { BulletListType } from '../../constants/BulletListType';
import { getMetadata, updateMetadata } from './updateMetadata';
import { NumberingListType } from '../../constants/NumberingListType';
import {
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
} from './definitionCreators';
import type {
    ListMetadataFormat,
    ObjectDefinition,
    ReadonlyContentModelWithDataset,
    ShallowMutableContentModelWithDataset,
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
 * Get list metadata
 * @param list The list Content Model (metadata holder)
 */
export function getListMetadata(
    list: ReadonlyContentModelWithDataset<ListMetadataFormat>
): ListMetadataFormat | null {
    return getMetadata(list, ListMetadataDefinition);
}

/**
 * Update list metadata with a callback
 * @param list The list Content Model (metadata holder)
 * @param callback The callback function used for updating metadata
 */
export function updateListMetadata(
    list: ShallowMutableContentModelWithDataset<ListMetadataFormat>,
    callback?: (format: ListMetadataFormat | null) => ListMetadataFormat | null
): ListMetadataFormat | null {
    return updateMetadata(list, callback, ListMetadataDefinition);
}
