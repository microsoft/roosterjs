import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { IEditor } from 'roosterjs-editor-types';
import { ListFeatures } from '../../../lib/plugins/ContentEdit/features/listFeatures';
import { Position, PositionContentSearcher } from 'roosterjs-editor-dom';

describe('listFeatures', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    let editorSearchCursorSpy: any;
    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        spyOn(editor, 'getElementAtCursor').and.returnValue(null);
        editorSearchCursorSpy = spyOn(editor, 'getContentSearcherOfCursor');
    });

    afterEach(() => {
        editor.dispose();
    });

    function runListPatternTest(text: string, expectedResult: boolean) {
        const root = document.createElement('div');
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        editorSearchCursorSpy.and.returnValue(mockedPosition);
        const isAutoBulletTriggered = ListFeatures.autoBullet.shouldHandleEvent(null, editor, false)
            ? true
            : false;
        expect(isAutoBulletTriggered).toBe(expectedResult);
    }

    it('AutoBullet detects the correct patterns', () => {
        runListPatternTest('1.', true);
        runListPatternTest('2.', true);
        runListPatternTest('1)', true);
        runListPatternTest('2)', true);
        runListPatternTest('90)', true);
        runListPatternTest('1-', true);
        runListPatternTest('2-', true);
        runListPatternTest('90-', true);
        runListPatternTest('(1)', true);
        runListPatternTest('(2)', true);
        runListPatternTest('(90)', true);
    });

    it('AutoBullet ignores incorrect not valid patterns', () => {
        runListPatternTest('1=', false);
        runListPatternTest('1/', false);
        runListPatternTest('1#', false);
        runListPatternTest(' ', false);
        runListPatternTest('', false);
    });
});
