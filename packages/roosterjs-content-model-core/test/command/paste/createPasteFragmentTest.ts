import * as moveChildNodes from 'roosterjs-content-model-dom/lib/domUtils/moveChildNodes';
import { ClipboardData, PasteType } from 'roosterjs-content-model-types';
import { createPasteFragment } from '../../../lib/command/paste/createPasteFragment';
import { expectHtml } from 'roosterjs-content-model-dom/test/testUtils';

describe('createPasteFragment', () => {
    let moveChildNodesSpy: jasmine.Spy;

    beforeEach(() => {
        moveChildNodesSpy = spyOn(moveChildNodes, 'moveChildNodes').and.callThrough();
    });

    function runTest(
        root: HTMLElement,
        clipboardData: ClipboardData,
        pasteType: PasteType,
        expectedHtml: string | string[],
        isMoveChildNodesCalled: boolean
    ) {
        const tempDiv = document.createElement('div');

        const fragment = createPasteFragment(document, clipboardData, pasteType, root);

        tempDiv.appendChild(fragment);

        expectHtml(tempDiv.innerHTML, expectedHtml);

        if (isMoveChildNodesCalled) {
            expect(moveChildNodesSpy).toHaveBeenCalledWith(fragment, root);
        } else {
            expect(moveChildNodesSpy).not.toHaveBeenCalled();
        }
    }

    it('Empty source, paste image', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: '',
                rawHtml: '',
                image: null,
                customValues: {},
            },
            'asImage',
            'HTML',
            true
        );
    });

    it('Has url, paste image', () => {
        runTest(
            document.createElement('div'),
            {
                types: [],
                text: '',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asImage',
            [
                '<img src="test" style="max-width: 100%;">',
                '<img style="max-width: 100%;" src="test">',
            ],
            false
        );
    });

    it('Has url, paste normal, no text', () => {
        runTest(
            document.createElement('div'),
            {
                types: [],
                text: '',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'normal',
            [
                '<img src="test" style="max-width: 100%;">',
                '<img style="max-width: 100%;" src="test">',
            ],
            false
        );
    });

    it('Has url, paste normal, has text', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: 'text',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'normal',
            'HTML',
            true
        );
    });

    it('Has url, paste plain text, no text', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: '',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            '',
            false
        );
    });

    it('Has text, paste normal', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: 'text',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'normal',
            'HTML',
            true
        );
    });

    it('Has text, paste text, single line', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: 'text',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            'text',
            false
        );
    });

    it('Has text, paste text, 2 lines', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: 'line1\r\nline2',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            'line1<br>line2',
            false
        );
    });

    it('Has text, paste text, 3 lines', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: 'line1\r\nline2\r\nline3',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            'line1<div>line2</div>line3',
            false
        );
    });

    it('Has text, paste text, 4 lines', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: 'line1\r\nline2\r\nline3\r\nline4',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            'line1<div>line2</div><div>line3</div>line4',
            false
        );
    });

    it('Has text, paste text, 1 line, has space', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: '  line    1   ',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            '&nbsp; line &nbsp; &nbsp;1 &nbsp;&nbsp;',
            false
        );
    });

    it('Has text, paste text, 2 line, has tab', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: '\tline 1\r\n  line\t2',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            '      line 1<br>&nbsp; line      2',
            false
        );
    });

    it('Has text, paste text, 2 line, has 2 tabs', () => {
        const root = document.createElement('div');

        root.innerHTML = 'HTML';
        runTest(
            root,
            {
                types: [],
                text: '1\t234\t5',
                rawHtml: '',
                image: null,
                customValues: {},
                imageDataUri: 'test',
            },
            'asPlainText',
            '1     234   5',
            false
        );
    });
});
