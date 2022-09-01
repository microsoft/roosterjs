import shouldConvertToSingleImage from '../../../lib/plugins/Paste/sourceValidations/shouldConvertToSingleImage';
import { ClipboardData, IEditor } from 'roosterjs-editor-types';
import { KnownSourceType } from '../../../lib/plugins/Paste/sourceValidations/KnownSourceType';

describe('shouldConvertToSingleImage |', () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = <IEditor>(<any>{
            isFeatureEnabled: () => true,
        });
    });

    it('Is Single Image', () => {
        spyOn(editor, 'isFeatureEnabled').and.returnValue(true);
        runTest(['IMG'], KnownSourceType.SingleImage);
    });

    it('Is Single Image, feature is not enabled', () => {
        spyOn(editor, 'isFeatureEnabled').and.returnValue(false);
        runTest(['IMG'], false);
    });

    it('Is Not single Image, feature is not enabled', () => {
        spyOn(editor, 'isFeatureEnabled').and.returnValue(false);
        runTest(['IMG', 'DIV'], false);
    });

    it('Is Not single Image, feature is enabled', () => {
        spyOn(editor, 'isFeatureEnabled').and.returnValue(true);
        runTest(['IMG', 'DIV'], false);
    });

    function runTest(htmlFirstLevelChildTags: string[], resultExpected: KnownSourceType | false) {
        const fragment = document.createDocumentFragment();
        const clipboardData = <ClipboardData>{
            htmlFirstLevelChildTags,
        };

        const result = shouldConvertToSingleImage({}, fragment, editor, clipboardData);

        expect(result).toEqual(resultExpected);
    }
});
