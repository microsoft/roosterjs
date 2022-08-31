import { ClipboardData, ExperimentalFeatures, IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 * Checks whether the fragment only contains a single image to paste
 * and the editor have the ConvertSingleImageBody Experimental feature
 * @param editor editor instance
 * @param clipboardData Clipboard data to check
 * @returns
 */
export function shouldConvertToSingleImage(editor: IEditor, clipboardData: ClipboardData) {
    return (
        editor.isFeatureEnabled(ExperimentalFeatures.ConvertSingleImageBody) &&
        clipboardData.htmlFirstLevelChildTags?.length == 1 &&
        clipboardData.htmlFirstLevelChildTags[0] == 'IMG'
    );
}
