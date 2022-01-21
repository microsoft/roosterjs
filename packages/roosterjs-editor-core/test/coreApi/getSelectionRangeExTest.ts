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

        const selectionEx = getSelectionRangeEx(core);
        selectionEx.ranges.forEach(range => {
            expect(range.startContainer).toBe(div);
            expect(range.endContainer).toBe(div);
            expect(range.startOffset).toBe(0);
            expect(range.endOffset).toBe(1);
        });
        document.body.removeChild(input);
    });

    it('use cache, focus is in editor', () => {
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
            expect(range.endOffset).toBe(1);
            cont++;
        });
    });
});
