import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { IEditor } from 'roosterjs-editor-types';
import { ListFeatures } from '../../../lib/plugins/ContentEdit/features/listFeatures';
import { Position, PositionContentSearcher } from 'roosterjs-editor-dom';

describe('listFeatures', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    let editorSearchCursorSpy: any;
    let editorIsFeatureEnabled: any;
    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        spyOn(editor, 'getElementAtCursor').and.returnValue(null);
        editorSearchCursorSpy = spyOn(editor, 'getContentSearcherOfCursor');
        editorIsFeatureEnabled = spyOn(editor, 'isFeatureEnabled');
    });

    afterEach(() => {
        editor.dispose();
    });

    function runListPatternTest(text: string, expectedResult: boolean) {
        const root = document.createElement('div');
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        editorSearchCursorSpy.and.returnValue(mockedPosition);
        editorIsFeatureEnabled.and.returnValue(false);
        const isAutoBulletTriggered = ListFeatures.autoBullet.shouldHandleEvent(null, editor, false)
            ? true
            : false;
        expect(isAutoBulletTriggered).toBe(expectedResult);
    }

    function runTestWithStyles(text: string, expectedResult: boolean) {
        const root = document.createElement('div');
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        editorIsFeatureEnabled.and.returnValue(true);
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

    it('AutoBullet with styles detects the correct patterns', () => {
        runTestWithStyles('1.', true);
        runTestWithStyles('1-', true);
        runTestWithStyles('1)', true);
        runTestWithStyles('(1)', true);
        runTestWithStyles('i.', true);
        runTestWithStyles('i-', true);
        runTestWithStyles('i)', true);
        runTestWithStyles('(i)', true);
        runTestWithStyles('I.', true);
        runTestWithStyles('I-', true);
        runTestWithStyles('I)', true);
        runTestWithStyles('(I)', true);
        runTestWithStyles('A.', true);
        runTestWithStyles('A-', true);
        runTestWithStyles('A)', true);
        runTestWithStyles('(A)', true);
        runTestWithStyles('a.', true);
        runTestWithStyles('a-', true);
        runTestWithStyles('a)', true);
        runTestWithStyles('(a)', true);
    });

    it('AutoBullet with ignores incorrect not valid patterns', () => {
        runTestWithStyles('1=', false);
        runTestWithStyles('1/', false);
        runTestWithStyles('1#', false);
        runTestWithStyles(' ', false);
        runTestWithStyles('', false);
    });
});
