import type { GetSourceFunction } from './getPasteSource';

/**
 * @internal
 * Checks whether the fragment only contains a single image to paste
 * and the editor have the ConvertSingleImageBody Experimental feature
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const shouldConvertToSingleImage: GetSourceFunction = props => {
    const { shouldConvertSingleImage, clipboardData } = props;
    return (
        shouldConvertSingleImage &&
        clipboardData.htmlFirstLevelChildTags?.length == 1 &&
        clipboardData.htmlFirstLevelChildTags[0] == 'IMG'
    );
};
