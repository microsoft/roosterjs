import type { GetSourceFunction, GetSourceInputParams } from './getPasteSource';

const ShadowWorkbookClipboardType = 'web data/shadow-workbook';

/**
 * @internal
 * When the clipboard content is retrieved programatically, the clipboard html does not contain the usual
 * attributes we use to determine if the content is from Excel. This function is used to handle that case.
 */
export const isExcelNotNativeEvent: GetSourceFunction = (props: GetSourceInputParams) => {
    const { clipboardData } = props;

    return (
        clipboardData.types.includes(ShadowWorkbookClipboardType) &&
        clipboardData.htmlFirstLevelChildTags?.length == 1 &&
        clipboardData.htmlFirstLevelChildTags[0] == 'TABLE'
    );
};
