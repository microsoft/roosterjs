import * as createRange from 'roosterjs-editor-dom/lib/selection/createRange';
import createEditorCore from './createMockEditorCore';
import { DefaultFormat, NodePosition, PositionType } from 'roosterjs-editor-types';
import { ensureTypeInContainer } from '../../lib/coreApi/ensureTypeInContainer';
import { Position } from 'roosterjs-editor-dom';

describe('ensureTypeInContainer', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        spyOn(createRange, 'default').and.callFake(pos => (pos as any) as Range);
    });

    afterEach(() => {
        document.body.removeChild(div!);
        div = null!;
    });

    function runTest(
        content: string,
        defaultFormat: DefaultFormat | undefined,
        event: KeyboardEvent | undefined,
        applyFormatToSpan: boolean,
        expectedHtml: string,
        expectedPos?: () => NodePosition
    ) {
        const position = new Position(div, PositionType.Begin);
        const selectRange = jasmine.createSpy('selectRange');
        const core = createEditorCore(div, {
            coreApiOverride: {
                selectRange: selectRange,
            },
            defaultFormat: defaultFormat,
        });
        core.api.setContent(core, content, true);

        ensureTypeInContainer(core, position, event, applyFormatToSpan);

        expect(div.innerHTML).toBe(expectedHtml);

        if (expectedPos) {
            expect(selectRange).toHaveBeenCalledWith(core, expectedPos());
        } else {
            expect(selectRange).not.toHaveBeenCalled();
        }
    }

    it('empty', () => {
        runTest('', undefined, undefined, true, '<div><br></div>');
    });

    it('empty, no format span', () => {
        runTest('', undefined, undefined, false, '<div><br></div>');
    });

    it('pure text', () => {
        runTest('text', undefined, undefined, false, '<div>text</div>');
    });

    it('div with text', () => {
        runTest('<div>text</div>', undefined, undefined, false, '<div>text</div>');
    });

    it('empty editor with format', () => {
        runTest(
            '',
            {
                fontSize: '10pt',
            },
            undefined,
            true,
            '<div style="font-size: 10pt;"><br></div>'
        );
    });

    it('empty editor with format, no format span', () => {
        runTest(
            '',
            {
                fontSize: '10pt',
            },
            undefined,
            false,
            '<div style="font-size: 10pt;"><br></div>'
        );
    });

    it('pure text with format', () => {
        runTest(
            'text',
            {
                fontSize: '10pt',
            },
            undefined,
            false,
            '<div>text</div>'
        );
    });

    it('div with text and format', () => {
        runTest(
            '<div>text</div>',
            {
                fontSize: '10pt',
            },
            undefined,
            false,
            '<div>text</div>'
        );
    });

    it('div with format and event', () => {
        runTest(
            '<div>a</div>',
            {
                fontSize: '10pt',
            },
            ({
                target: div,
                key: 'a',
            } as any) as KeyboardEvent,
            false,
            '<div style="font-size: 10pt;">a</div>',
            () => new Position(div.firstChild?.firstChild, PositionType.Begin)
        );
    });

    it('div with format and event and use span', () => {
        runTest(
            '<div>a</div>',
            {
                fontSize: '10pt',
            },
            ({
                target: div,
                key: 'a',
            } as any) as KeyboardEvent,
            true,
            '<div style="font-size: 10pt;">a</div>',
            () =>
                new Position(<NodePosition>(<any>{
                    element: div.firstChild?.firstChild,
                    isAtEnd: false,
                    offset: 0,
                    node: div.firstChild?.firstChild,
                }))
        );
    });

    it('div with format and event and use span, div is not created from the event', () => {
        runTest(
            '<div>a</div>',
            {
                fontSize: '10pt',
            },
            ({
                target: div,
                key: 'b',
            } as any) as KeyboardEvent,
            true,
            '<div>a</div>',
            () => new Position(div.firstChild!.firstChild, PositionType.Begin)
        );
    });

    it('table with format and event and not use span', () => {
        runTest(
            '<table><tr><td id="td"></td></tr></table>',
            {
                fontSize: '10pt',
            },
            ({
                target: div,
                key: 'a',
            } as any) as KeyboardEvent,
            false,
            '<table><tbody><tr><td id="td" style="font-size: 10pt;"><br></td></tr></tbody></table>',
            () => new Position(div.querySelector('#td'), PositionType.Begin)
        );
    });

    it('table with format and event and use span', () => {
        runTest(
            '<table><tr><td id="td"></td></tr></table>',
            {
                fontSize: '10pt',
            },
            ({
                target: div,
                key: 'a',
            } as any) as KeyboardEvent,
            true,
            '<table><tbody><tr><td id="td" style="font-size: 10pt;"><br></td></tr></tbody></table>',
            () => new Position(div.querySelector('#td')!, PositionType.Begin)
        );
    });
});
