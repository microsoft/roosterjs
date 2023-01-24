import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

/**
 * @internal
 * Checks whether the fragment only contains a single image to paste
 * and the editor have the ConvertSingleImageBody Experimental feature
 * @param props Properties related to the PasteEvent
 * @returns
 */
const shouldConvertToSingleImage: getSourceFunction = (props: getSourceInputParams) => {
    const { shouldConvertSingleImage, clipboardData } = props;
    return (
        shouldConvertSingleImage &&
        clipboardData.htmlFirstLevelChildTags?.length == 1 &&
        clipboardData.htmlFirstLevelChildTags[0] == 'IMG'
    );
};

export default shouldConvertToSingleImage;
