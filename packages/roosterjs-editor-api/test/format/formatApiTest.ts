import * as applyInlineStyle from '../../lib/utils/applyInlineStyle';
import * as TestHelper from '../TestHelper';
import setBackgroundColor from '../../lib/format/setBackgroundColor';
import setFontName from '../../lib/format/setFontName';
import setFontSize from '../../lib/format/setFontSize';
import setTextColor from '../../lib/format/setTextColor';
import toggleStrikethrough from '../../lib/format/toggleStrikethrough';
import toggleSubscript from '../../lib/format/toggleSubscript';
import toggleSuperscript from '../../lib/format/toggleSuperscript';
import { Browser } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';
describe('FormatUtils', () => {
    let testID = 'toggle';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('toggleStrikethrough() triggers the strikethrough command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleStrikethrough(editor);

        expect(document.execCommand).toHaveBeenCalledWith('strikeThrough', false, undefined);
    });

    it('toggleSuperscript() triggers the superscript command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleSuperscript(editor);

        expect(document.execCommand).toHaveBeenCalledWith('superscript', false, undefined);
    });

    it('toggleSubscript() triggers the subscript command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleSubscript(editor);

        expect(document.execCommand).toHaveBeenCalledWith('subscript', false, undefined);
    });

    it('setTextColor() triggers the applyInlineStyle method in editor', () => {
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockColor = 'red';
        setTextColor(editor, mockColor);

        expect((<any>editor).core.pendingFormatState.pendableFormatSpan.style.color).toBe(
            mockColor
        );
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.color).toBe(mockColor);
    });

    it('setBackgroundColor() triggers the applyInlineStyle method in editor', () => {
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockColor = 'red';
        setBackgroundColor(editor, mockColor);

        expect((<any>editor).core.pendingFormatState.pendableFormatSpan.style.backgroundColor).toBe(
            mockColor
        );
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.backgroundColor).toBe(mockColor);
    });

    it('setFontName() triggers the applyInlineStyle method in editor', () => {
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockFontName = 'Calibri, Arial, Helvetica, sans-serif';
        setFontName(editor, mockFontName);

        expect((<any>editor).core.pendingFormatState.pendableFormatSpan.style.fontFamily).toBe(
            mockFontName
        );
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.fontFamily).toBe(mockFontName);
    });

    it('setFontSize() triggers the applyInlineStyle method in editor', () => {
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockFontSize = '6pt';
        setFontSize(editor, mockFontSize);

        expect((<any>editor).core.pendingFormatState.pendableFormatSpan.style.fontSize).toBe(
            mockFontSize
        );
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.fontSize).toBe(mockFontSize);
    });

    xit('setFontSize() table selection', () => {
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(applyInlineStyle, 'default').and.callThrough();
        editor.setContent(TestHelper.tableSelectionContents[0]);
        let mockFontSize = '6pt';
        setFontSize(editor, mockFontSize);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(applyInlineStyle.default).toHaveBeenCalled();
        expect(editor.getContent()).toBe(
            Browser.isFirefox
                ? '<table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>'
                : '<table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 6pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>'
        );
    });
});
