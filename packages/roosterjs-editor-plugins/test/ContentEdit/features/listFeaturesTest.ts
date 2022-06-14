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

    function runTestWithNumberingStyles(text: string, expectedResult: boolean) {
        const root = document.createElement('div');
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        editorIsFeatureEnabled.and.returnValue(true);
        editorSearchCursorSpy.and.returnValue(mockedPosition);
        const isAutoBulletTriggered = ListFeatures.autoNumberingList.shouldHandleEvent(
            null,
            editor,
            false
        )
            ? true
            : false;
        expect(isAutoBulletTriggered).toBe(expectedResult);
    }

    function runTestWithBulletStyles(text: string, expectedResult: boolean) {
        const root = document.createElement('div');
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        editorIsFeatureEnabled.and.returnValue(true);
        editorSearchCursorSpy.and.returnValue(mockedPosition);
        const isAutoBulletTriggered = ListFeatures.autoBulletList.shouldHandleEvent(
            null,
            editor,
            false
        )
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

    it('AutoBulletList detects the correct patterns', () => {
        runTestWithBulletStyles('*', true);
        runTestWithBulletStyles('-', true);
        runTestWithBulletStyles('--', true);
        runTestWithBulletStyles('->', true);
        runTestWithBulletStyles('-->', true);
        runTestWithBulletStyles('>', true);
        runTestWithBulletStyles('=>', true);
        runTestWithBulletStyles('—', true);
    });

    it('AutoNumberingList with styles detects the correct patterns', () => {
        runTestWithNumberingStyles('1.', true);
        runTestWithNumberingStyles('1-', true);
        runTestWithNumberingStyles('1)', true);
        runTestWithNumberingStyles('(1)', true);
        runTestWithNumberingStyles('i.', true);
        runTestWithNumberingStyles('i-', true);
        runTestWithNumberingStyles('i)', true);
        runTestWithNumberingStyles('(i)', true);
        runTestWithNumberingStyles('I.', true);
        runTestWithNumberingStyles('I-', true);
        runTestWithNumberingStyles('I)', true);
        runTestWithNumberingStyles('(I)', true);
        runTestWithNumberingStyles('A.', true);
        runTestWithNumberingStyles('A-', true);
        runTestWithNumberingStyles('A)', true);
        runTestWithNumberingStyles('(A)', true);
        runTestWithNumberingStyles('a.', true);
        runTestWithNumberingStyles('a-', true);
        runTestWithNumberingStyles('a)', true);
        runTestWithNumberingStyles('(a)', true);
    });

    it('AutoBullet with ignores incorrect not valid patterns', () => {
        runListPatternTest('1=', false);
        runListPatternTest('1/', false);
        runListPatternTest('1#', false);
        runListPatternTest(' ', false);
        runListPatternTest('', false);
    });

    it('AutoBulletList with ignores incorrect not valid patterns', () => {
        runTestWithBulletStyles('1=', false);
        runTestWithBulletStyles('1/', false);
        runTestWithBulletStyles('1#', false);
        runTestWithBulletStyles(' ', false);
        runTestWithBulletStyles('', false);
    });

    it('AutoNumberingList with ignores incorrect not valid patterns', () => {
        runTestWithNumberingStyles('1=', false);
        runTestWithNumberingStyles('1/', false);
        runTestWithNumberingStyles('1#', false);
        runTestWithNumberingStyles(' ', false);
        runTestWithNumberingStyles('', false);
    });
});
