import type { GetSourceFunction } from './getDocumentSource';

/**
 * @internal
 * Checks whether the fragment only contains a single image to paste
 * and the editor have the ConvertSingleImageBody Experimental feature
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const shouldConvertToSingleImage: GetSourceFunction = props => {
    const { shouldConvertSingleImage, htmlFirstLevelChildTags } = props;
    return !!(
        shouldConvertSingleImage &&
        htmlFirstLevelChildTags?.length == 1 &&
        htmlFirstLevelChildTags[0] == 'IMG'
    );
};
