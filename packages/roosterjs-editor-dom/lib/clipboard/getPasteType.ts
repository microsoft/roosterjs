import { PasteType } from 'roosterjs-editor-types';

/**
 * Get the paste type that will be used corresponding to the configuration
 * @param pasteAsText Whether to paste as Text
 * @param applyCurrentStyle Whether to apply the current format to the content
 * @param pasteAsImage Whether to only paste the image
 * @param pasteAsTextWithClickableLinks whether to past plain text with clickable links
 * @returns
 */
export default function getPasteType(
    pasteAsText: boolean,
    applyCurrentStyle: boolean,
    pasteAsImage: boolean,
    pasteAsTextWithClickableLinks: boolean
) {
    if (pasteAsText) {
        return PasteType.AsPlainText;
    } else if (applyCurrentStyle) {
        return PasteType.MergeFormat;
    } else if (pasteAsImage) {
        return PasteType.AsImage;
    } else if (pasteAsTextWithClickableLinks) {
        return PasteType.AsPlainTextWithClickableLinks;
    } else {
        return PasteType.Normal;
    }
}
