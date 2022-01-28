import createEditorCore from './createMockEditorCore';
import { getSelectionRangeEx } from '../../lib/coreApi/getSelectionRangeEx';
import { selectNode } from '../TestHelper';

describe('getSelectionRangeEx', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('do not use cache, focus is not in editor', () => {
        const core = createEditorCore(div, {});
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();
        const selection = getSelectionRangeEx(core);
        expect(selection.ranges[0]).toBeNull();
        document.body.removeChild(input);
    });

    it('do not use cache, focus is in editor', () => {
        const core = createEditorCore(div, {});
        div.contentEditable = 'true';
        div.innerHTML = '<div>test</div>';
        selectNode(div.firstChild);

        const selectionEx = getSelectionRangeEx(core);
        selectionEx.ranges.forEach(range => {
            expect(range.startContainer).toBe(div);
            expect(range.endContainer).toBe(div);
            expect(range.startOffset).toBe(0);
            expect(range.endOffset).toBe(1);
        });
    });

    it('use cache, focus is not in editor', () => {
        const core = createEditorCore(div, {});
        const cachedRange = document.createRange();
        core.domEvent = {
            selectionRange: cachedRange,
            isInIME: false,
            scrollContainer: null,
            stopPrintableKeyboardEventPropagation: false,
            contextMenuProviders: [],
        };
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();

        const selection = getSelectionRangeEx(core);
        selection.ranges.forEach(range => {
            expect(range).toBe(cachedRange);
        });
        document.body.removeChild(input);
    });

    it('table selection', () => {
        const core = createEditorCore(div, {});
        div.contentEditable = 'true';
        div.innerHTML =
            '<div><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" scope="" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" scope="" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" scope=""><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" scope="" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" scope="" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table><br></div>';
        selectNode(div.firstChild);
        const selectionEx = getSelectionRangeEx(core);
        expect(selectionEx.ranges.length).toBe(3);
        let cont = 1;
        selectionEx.ranges.forEach(range => {
            const tr = div.querySelector(`tr:nth-child(${cont})`);
            expect(range.startContainer).toBe(tr);
            expect(range.endContainer).toBe(tr);
            expect(range.startOffset).toBe(0);
            expect(range.endOffset).toBe(2);
            cont++;
        });
    });

    function runTest(input: string, id: string, expectedRangesLength: number[][]) {
        const core = createEditorCore(div, {});

        div.contentEditable = 'true';
        div.innerHTML = input;
        div.focus();
        selectNode(div.querySelector('#' + id));
        const selection = getSelectionRangeEx(core);
        const ranges = selection.ranges;

        expectedRangesLength.forEach((value, i) => {
            expect(ranges[i].startOffset).toBe(value[0]);
            expect(ranges[i].endOffset).toBe(value[1]);
        });

        expect(ranges.length).toBe(expectedRangesLength.length);
    }

    it('Complex table', () => {
        let html =
            '<div><table id="id0" style="font-size:medium" class="_tableSelected"><tbody><tr><td rowspan="2" class="_tableCellSelected" style="background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="">1</td><td colspan="2" class="_tableCellSelected" style="background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="">2</td></tr><tr><td class="_tableCellSelected" style="background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="">3</td><td rowspan="2" class="_tableCellSelected" style="background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="">4</td></tr><tr><td colspan="2" class="_tableCellSelected" style="background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="">5</td></tr></tbody></table><br></div>';
        runTest(html, 'id0', [
            [0, 2],
            [0, 2],
            [0, 1],
        ]);
    });
    it('Simple table selection 1', () => {
        runTest(
            '<table id="id0"  class="_tableSelected"><tbody><tr><td class="_tableCellSelected" style="background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="">2</td></tr><tr><td id="id2" class="_tableCellSelected" style="background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="">4</td></tr></tbody></table>',
            'id0',
            [
                [0, 1],
                [0, 1],
            ]
        );
    });
    it('Simple table selection 2', () => {
        runTest(
            '<table id="id0" cellspacing="0" cellpadding="1" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" colspan="2" data-original-background-color="" class="_tableCellSelected"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" colspan="2" class="_tableCellSelected" data-original-background-color=""><br><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" rowspan="2" colspan="2" data-original-background-color="" class="_tableCellSelected"><br><br><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" colspan="2" data-original-background-color="" class="_tableCellSelected"><br><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" colspan="2" data-original-background-color="" class="_tableCellSelected"></td></tr></tbody></table><br>',
            'id0',
            [
                [0, 6],
                [0, 5],
                [0, 4],
                [0, 3],
                [0, 5],
            ]
        );
    });
    it('Simple table selection 3', () => {
        runTest(
            '<table id="id0" cellspacing="0" cellpadding="1" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""><br><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" colspan="2" class="_tableCellSelected" data-original-background-color=""><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" colspan="2" class="_tableCellSelected" data-original-background-color=""><br><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" rowspan="2" colspan="2" class="_tableCellSelected" data-original-background-color=""><br><br><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" colspan="2" class=""><br><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" class=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" class="_tableCellSelected" data-original-background-color=""><br></td><td style="width: 100px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" colspan="2" class="_tableCellSelected" data-original-background-color=""></td></tr></tbody></table><br>',
            'id0',
            [
                [2, 6],
                [2, 5],
                [2, 4],
                [1, 3],
                [2, 5],
            ]
        );
    });
});
