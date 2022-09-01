import { ClipboardData, ExperimentalFeatures, IEditor } from 'roosterjs-editor-types';
import { getSourceFunction } from './getPasteSource';
import { KnownSourceType } from './KnownSourceType';

/**
 * @internal
 * Checks whether the fragment only contains a single image to paste
 * and the editor have the ConvertSingleImageBody Experimental feature
 * @param editor editor instance
 * @param clipboardData Clipboard data to check
 * @returns
 */
const shouldConvertToSingleImage: getSourceFunction = (
    htmlAttributes: Record<string, string>,
    fragment: DocumentFragment,
    editor: IEditor,
    clipboardData: ClipboardData
) =>
    editor.isFeatureEnabled(ExperimentalFeatures.ConvertSingleImageBody) &&
    clipboardData.htmlFirstLevelChildTags?.length == 1 &&
    clipboardData.htmlFirstLevelChildTags[0] == 'IMG'
        ? KnownSourceType.SingleImage
        : false;

export default shouldConvertToSingleImage;
