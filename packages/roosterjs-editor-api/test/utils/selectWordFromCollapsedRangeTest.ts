import selectWordFromCollapsedRange from '../../lib/utils/selectWordFromCollapsedRange';
import { Editor } from 'roosterjs-editor-core';
import { IEditor } from 'roosterjs-editor-types';

describe('selectWordFromCollapsedRange', () => {
    let div: HTMLDivElement;
    let span: HTMLSpanElement;
    let editor: IEditor;

    beforeEach(() => {
        div = document.createElement('div');
        div.append((span = document.createElement('span')));
        div.id = 'id';
        editor = new Editor(div as HTMLDivElement, {
            plugins: [],
            defaultFormat: {
                textColor: 'black',
                fontFamily: 'arial',
                fontSize: '12pt',
            },
            experimentalFeatures: [],
        });
        document.body.append(div);
    });

    afterEach(() => {
        div.parentElement?.removeChild(div);
        editor.dispose();
    });

    xit('Select Word', () => {
        //'|Word'
        runTest('Word', () => getRange(0), 0, 4, false);
    });

    xit('Select Word 2', () => {
        //'Wo|rd'
        runTest('Word', () => getRange(2), 0, 4, false);
    });

    xit('Select word, at the end of a word', () => {
        //' Word| '
        runTest(' Word ', () => getRange(5), 1, 5, false);
    });

    xit('Do not select word, range is not collapsed', () => {
        //'|Wo|rd'
        runTest('Word', () => getRange(0, 2), 0, 2, false);
    });

    xit('Do not select word, space at beginning of string', () => {
        //'| Word'
        runTest(' Word', () => getRange(0), 0, 0, true);
    });

    it('Do not select word, space at end of string 2', () => {
        //' Word |'
        runTest(' Word ', () => getRange(6), 6, 6, true);
    });

    xit('Do not select word, cursor between spaces', () => {
        //' Word | Word'
        runTest(' Word  Word', () => getRange(6), 6, 6, true);
    });

    function runTest(
        text: string,
        getRangeInput: () => Range,
        startOffset: number,
        endOffset: number,
        isCollapsed: boolean
    ) {
        span.textContent = text;

        editor.focus();
        const range = getRangeInput();
        selectWordFromCollapsedRange(range, editor);

        expect(range.startOffset).toBe(startOffset);
        expect(range.endOffset).toBe(endOffset);
        expect(range.collapsed).toBe(isCollapsed);
    }

    function getRange(startOffset: number, endOffset?: number) {
        const range = new Range();
        range.setStart(span.firstChild!, startOffset);
        if (endOffset) {
            range.setEnd(span.firstChild!, endOffset);
        }
        return range;
    }
});
