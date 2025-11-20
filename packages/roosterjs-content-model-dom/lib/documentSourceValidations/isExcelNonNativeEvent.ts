import type { GetSourceInputParams } from 'roosterjs-content-model-types';
import type { GetSourceFunction } from './getDocumentSource';

const ShadowWorkbookClipboardType = 'web data/shadow-workbook';

/**
 * @internal
 * When the clipboard content is retrieved programatically, the clipboard html does not contain the usual
 * attributes we use to determine if the content is from Excel. This function is used to handle that case.
 */
export const isExcelNotNativeEvent: GetSourceFunction = (props: GetSourceInputParams) => {
    const { clipboardItemTypes, htmlFirstLevelChildTags } = props;

    return !!(
        clipboardItemTypes &&
        clipboardItemTypes.includes(ShadowWorkbookClipboardType) &&
        htmlFirstLevelChildTags?.length == 1 &&
        htmlFirstLevelChildTags[0] == 'TABLE'
    );
};
