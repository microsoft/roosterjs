import { ExperimentalFeatures } from 'roosterjs-editor-types';
import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

/**
 * @internal
 * Checks whether the fragment only contains a single image to paste
 * and the editor have the ConvertSingleImageBody Experimental feature
 * @param props Properties related to the PasteEvent
 * @returns
 */
const shouldConvertToSingleImage: getSourceFunction = (props: getSourceInputParams) => {
    const { editor, clipboardData } = props;
    return (
        editor.isFeatureEnabled(ExperimentalFeatures.ConvertSingleImageBody) &&
        clipboardData.htmlFirstLevelChildTags?.length == 1 &&
        clipboardData.htmlFirstLevelChildTags[0] == 'IMG'
    );
};

export default shouldConvertToSingleImage;
