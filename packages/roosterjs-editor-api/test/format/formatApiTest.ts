import * as applyInlineStyle from '../../lib/utils/applyInlineStyle';
import * as TestHelper from '../TestHelper';
import setBackgroundColor from '../../lib/format/setBackgroundColor';
import setFontName from '../../lib/format/setFontName';
import setFontSize from '../../lib/format/setFontSize';
import setTextColor from '../../lib/format/setTextColor';
import toggleStrikethrough from '../../lib/format/toggleStrikethrough';
import toggleSubscript from '../../lib/format/toggleSubscript';
import toggleSuperscript from '../../lib/format/toggleSuperscript';
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

        expect(document.execCommand).toHaveBeenCalledWith('strikeThrough', false, null);
    });

    it('toggleSuperscript() triggers the superscript command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleSuperscript(editor);

        expect(document.execCommand).toHaveBeenCalledWith('superscript', false, null);
    });

    it('toggleSubscript() triggers the subscript command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleSubscript(editor);

        expect(document.execCommand).toHaveBeenCalledWith('subscript', false, null);
    });

    it('setTextColor() triggers the applyInlineStyle method in editor', () => {
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockColor = 'red';
        setTextColor(editor, mockColor);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.color).toBe(mockColor);
    });

    it('setBackgroundColor() triggers the applyInlineStyle method in editor', () => {
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockColor = 'red';
        setBackgroundColor(editor, mockColor);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.backgroundColor).toBe(mockColor);
    });

    it('setFontName() triggers the applyInlineStyle method in editor', () => {
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockFontName = 'Calibri, Arial, Helvetica, sans-serif';
        setFontName(editor, mockFontName);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.fontFamily).toBe(mockFontName);
    });

    it('setFontSize() triggers the applyInlineStyle method in editor', () => {
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(applyInlineStyle, 'default').and.callThrough();

        let mockFontSize = '6pt';
        setFontSize(editor, mockFontSize);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(applyInlineStyle.default).toHaveBeenCalled();

        let style = (<jasmine.Spy>applyInlineStyle.default).calls.argsFor(0)[1];
        let element = document.createElement('div');
        style(element);
        expect(element.style.fontSize).toBe(mockFontSize);
    });
});
