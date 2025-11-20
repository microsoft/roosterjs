import { ClipboardData } from 'roosterjs-content-model-types';
import { GetSourceInputParams } from '../../../lib/paste/pasteSourceValidations/getDocumentSource';
import { shouldConvertToSingleImage } from '../../../lib/paste/pasteSourceValidations/shouldConvertToSingleImage';

describe('shouldConvertToSingleImage |', () => {
    it('Is Single Image', () => {
        runTest(['IMG'], true, true /* shouldConvertToSingleImage */);
    });

    it('Is Single Image, feature is not enabled', () => {
        runTest(['IMG'], false, false /* shouldConvertToSingleImage */);
    });

    it('Is Not single Image, feature is not enabled', () => {
        runTest(['IMG', 'DIV'], false, false /* shouldConvertToSingleImage */);
    });

    it('Is Not single Image, feature is enabled', () => {
        runTest(['IMG', 'DIV'], false, true /* shouldConvertToSingleImage */);
    });

    function runTest(
        htmlFirstLevelChildTags: string[],
        resultExpected: boolean,
        shouldConvertToSingleImageInput: boolean
    ) {
        const fragment = document.createDocumentFragment();

        const result = shouldConvertToSingleImage(<GetSourceInputParams>{
            fragment,
            shouldConvertSingleImage: shouldConvertToSingleImageInput,
            htmlFirstLevelChildTags,
            htmlAttributes: {},
            environment: {} as any,
        });

        expect(result).toEqual(resultExpected);
    }
});
