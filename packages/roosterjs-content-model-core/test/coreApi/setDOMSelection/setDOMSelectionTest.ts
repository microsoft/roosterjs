import * as addRangeToSelection from '../../../lib/coreApi/setDOMSelection/addRangeToSelection';
import { DOMSelection, EditorCore } from 'roosterjs-content-model-types';
import { setDOMSelection } from '../../../lib/coreApi/setDOMSelection/setDOMSelection';

describe('setDOMSelection', () => {
    let core: EditorCore;
    let querySelectorAllSpy: jasmine.Spy;
    let hasFocusSpy: jasmine.Spy;
    let triggerEventSpy: jasmine.Spy;
    let addRangeToSelectionSpy: jasmine.Spy;
    let createRangeSpy: jasmine.Spy;
    let setEditorStyleSpy: jasmine.Spy;
    let containsSpy: jasmine.Spy;
    let doc: Document;
    let contentDiv: HTMLDivElement;
    let mockedRange = 'RANGE' as any;

    beforeEach(() => {
        querySelectorAllSpy = jasmine.createSpy('querySelectorAll');
        hasFocusSpy = jasmine.createSpy('hasFocus');
        triggerEventSpy = jasmine.createSpy('triggerEvent');
        addRangeToSelectionSpy = spyOn(addRangeToSelection, 'addRangeToSelection').and.callFake(
            () => {
                expect(core.selection.skipReselectOnFocus).toBeTrue();
            }
        );
        createRangeSpy = jasmine.createSpy('createRange');
        setEditorStyleSpy = jasmine.createSpy('setEditorStyle');
        containsSpy = jasmine.createSpy('contains').and.returnValue(true);

        doc = {
            querySelectorAll: querySelectorAllSpy,
            createRange: createRangeSpy,
            contains: containsSpy,
        } as any;
        contentDiv = {
            ownerDocument: doc,
        } as any;

        core = {
            physicalRoot: contentDiv,
            logicalRoot: contentDiv,
            selection: {},
            api: {
                triggerEvent: triggerEventSpy,
                setEditorStyle: setEditorStyleSpy,
            },
            domHelper: {
                hasFocus: hasFocusSpy,
            },
        } as any;
    });

    describe('Null selection', () => {
        beforeEach(() => {
            querySelectorAllSpy.and.returnValue([]);
        });

        function runTest(originalSelection: DOMSelection | null) {
            core.selection.selection = originalSelection;

            setDOMSelection(core, null);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: null,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: null,
                },
                true
            );
            expect(addRangeToSelectionSpy).not.toHaveBeenCalled();
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
        }

        it('From null selection', () => {
            runTest(null);
        });

        it('From range selection', () => {
            runTest({
                type: 'range',
                range: {} as any,
                isReverted: false,
            });
        });

        it('From image selection', () => {
            runTest({
                type: 'image',
                image: {} as any,
            });
        });

        it('From table selection', () => {
            runTest({
                type: 'table',
                table: {} as any,
                firstColumn: 0,
                firstRow: 0,
                lastColumn: 1,
                lastRow: 1,
            });
        });
    });

    describe('Range selection', () => {
        it('range selection, editor id is unique, editor has focus, trigger event', () => {
            const mockedSelection = {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            } as any;

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(true);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: null,
            } as any);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(
                doc,
                mockedRange,
                false /* isReverted */
            );
        });

        it('range selection, editor id is unique, editor has focus, do not trigger event', () => {
            const mockedSelection = {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            } as any;

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(true);

            setDOMSelection(core, mockedSelection, true);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: null,
            } as any);
            expect(triggerEventSpy).not.toHaveBeenCalled();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange, false);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
        });

        it('range selection, editor id is unique, editor does not have focus', () => {
            const mockedSelection = {
                type: 'range',
                range: mockedRange,
                isReverted: false,
            } as any;

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange, false);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
        });
    });

    describe('Image selection', () => {
        let mockedImage: HTMLImageElement;

        beforeEach(() => {
            mockedImage = {
                ownerDocument: doc,
            } as any;
        });

        it('image selection', () => {
            const mockedSelection = {
                type: 'image',
                image: mockedImage,
            } as any;
            const selectNodeSpy = jasmine.createSpy('selectNode');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                selectNode: selectNodeSpy,
                collapse: collapseSpy,
            };

            createRangeSpy.and.returnValue(mockedRange);

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(selectNodeSpy).toHaveBeenCalledWith(mockedImage);
            expect(collapseSpy).toHaveBeenCalledWith();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange);
            expect(mockedImage.id).toBe('image_0');
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(4);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:auto!important; outline-color:#DB626C!important;',
                ['#image_0']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideCursor',
                'caret-color: transparent'
            );
        });

        it('image selection with duplicated id', () => {
            const mockedSelection = {
                type: 'image',
                image: mockedImage,
            } as any;
            const selectNodeSpy = jasmine.createSpy('selectNode');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                selectNode: selectNodeSpy,
                collapse: collapseSpy,
            };

            mockedImage.id = 'image_0';
            createRangeSpy.and.returnValue(mockedRange);

            querySelectorAllSpy.and.callFake(selector => {
                return selector == '#image_0' ? ['', ''] : [''];
            });
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(selectNodeSpy).toHaveBeenCalledWith(mockedImage);
            expect(collapseSpy).toHaveBeenCalledWith();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(4);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:auto!important; outline-color:#DB626C!important;',
                ['#image_0_0']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideCursor',
                'caret-color: transparent'
            );
        });

        it('image selection with customized selection border color', () => {
            const mockedSelection = {
                type: 'image',
                image: mockedImage,
            } as any;
            const selectNodeSpy = jasmine.createSpy('selectNode');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                selectNode: selectNodeSpy,
                collapse: collapseSpy,
            };

            core.selection.imageSelectionBorderColor = 'red';

            createRangeSpy.and.returnValue(mockedRange);

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
                imageSelectionBorderColor: 'red',
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(selectNodeSpy).toHaveBeenCalledWith(mockedImage);
            expect(collapseSpy).toHaveBeenCalledWith();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(4);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:auto!important; outline-color:red!important;',
                ['#image_0']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideCursor',
                'caret-color: transparent'
            );
        });

        it('do not select if node is out of document', () => {
            const mockedSelection = {
                type: 'image',
                image: mockedImage,
            } as any;
            const selectNodeSpy = jasmine.createSpy('selectNode');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                selectNode: selectNodeSpy,
                collapse: collapseSpy,
            };

            doc.contains = () => false;

            createRangeSpy.and.returnValue(mockedRange);

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(selectNodeSpy).not.toHaveBeenCalled();
            expect(collapseSpy).not.toHaveBeenCalled();
            expect(addRangeToSelectionSpy).not.toHaveBeenCalled();
            expect(mockedImage.id).toBe('image_0');
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(4);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:auto!important; outline-color:#DB626C!important;',
                ['#image_0']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideCursor',
                'caret-color: transparent'
            );
        });
    });

    describe('Table selection', () => {
        let mockedTable: HTMLTableElement;

        beforeEach(() => {
            mockedTable = {
                ownerDocument: doc,
                rows: [],
                childNodes: [],
            } as any;
        });

        it('empty table', () => {
            const mockedSelection = {
                type: 'table',
                table: mockedTable,
            } as any;
            const selectNodeSpy = jasmine.createSpy('selectNode');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                selectNode: selectNodeSpy,
                collapse: collapseSpy,
            };

            createRangeSpy.and.returnValue(mockedRange);

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(selectNodeSpy).not.toHaveBeenCalled();
            expect(collapseSpy).not.toHaveBeenCalled();
            expect(addRangeToSelectionSpy).not.toHaveBeenCalled();
            expect(mockedTable.id).toBe('table_0');

            expect(setEditorStyleSpy).toHaveBeenCalledTimes(4);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'background-color:#C6C6C6!important;',
                []
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideCursor',
                'caret-color: transparent'
            );
        });

        function runTest(
            mockedTable: HTMLTableElement,
            firstColumn: number,
            firstRow: number,
            lastColumn: number,
            lastRow: number,
            result: string[]
        ) {
            const mockedSelection = {
                type: 'table',
                table: mockedTable,
                firstColumn,
                firstRow,
                lastColumn,
                lastRow,
            } as any;
            const selectNodeSpy = jasmine.createSpy('selectNode');
            const collapseSpy = jasmine.createSpy('collapse');
            const mockedRange = {
                selectNode: selectNodeSpy,
                collapse: collapseSpy,
            };

            createRangeSpy.and.returnValue(mockedRange);

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(core, mockedSelection);

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(mockedTable.id).toBe('table_0');
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(4);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'background-color:#C6C6C6!important;',
                result
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideCursor',
                'caret-color: transparent'
            );
        }

        it('Select Table Cells TR under Table Tag', () => {
            runTest(buildTable(true), 1, 0, 1, 1, [
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2)',
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
                '#table_0>TBODY> tr:nth-child(2)>TD:nth-child(2)',
                '#table_0>TBODY> tr:nth-child(2)>TD:nth-child(2) *',
            ]);
        });

        it('Select Table Cells TBODY', () => {
            runTest(buildTable(false), 0, 0, 0, 1, [
                '#table_0> tr:nth-child(1)>TD:nth-child(1)',
                '#table_0> tr:nth-child(1)>TD:nth-child(1) *',
                '#table_0> tr:nth-child(2)>TD:nth-child(1)',
                '#table_0> tr:nth-child(2)>TD:nth-child(1) *',
            ]);
        });

        it('Select TH and TR in the same row', () => {
            const table = document.createElement('table');
            const tr1 = document.createElement('tr');
            const th1 = document.createElement('th');
            const td1 = document.createElement('td');
            const tr2 = document.createElement('tr');
            const th2 = document.createElement('th');
            const td2 = document.createElement('td');

            th1.appendChild(document.createTextNode('test'));
            td1.appendChild(document.createTextNode('test'));
            tr1.appendChild(th1);
            tr1.appendChild(td1);

            th2.appendChild(document.createTextNode('test'));
            td2.appendChild(document.createTextNode('test'));
            tr2.appendChild(th2);
            tr2.appendChild(td2);

            table.appendChild(tr1);
            table.appendChild(tr2);

            runTest(table, 0, 0, 0, 1, [
                '#table_0> tr:nth-child(1)>TH:nth-child(1)',
                '#table_0> tr:nth-child(1)>TH:nth-child(1) *',
                '#table_0> tr:nth-child(2)>TH:nth-child(1)',
                '#table_0> tr:nth-child(2)>TH:nth-child(1) *',
            ]);
        });

        it('Select TD after merged cell', () => {
            const div = document.createElement('div');
            div.innerHTML =
                '<table><tr><td colspan=2></td><td><div id="div1"><br></div></td></tr></table>';
            const table = div.firstChild as HTMLTableElement;
            const innerDIV = div.querySelector('#div1');

            runTest(table, 2, 0, 2, 0, [
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2)',
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
            ]);

            expect(containsSpy).toHaveBeenCalledTimes(1);
            expect(containsSpy).toHaveBeenCalledWith(innerDIV);
        });

        it('Select Table Cells THEAD, TBODY', () => {
            runTest(buildTable(true /* tbody */, true /* thead */), 1, 1, 2, 2, [
                '#table_0>THEAD> tr:nth-child(2)>TD:nth-child(2)',
                '#table_0>THEAD> tr:nth-child(2)>TD:nth-child(2) *',
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2)',
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
            ]);
        });

        it('Select Table Cells TBODY, TFOOT', () => {
            runTest(buildTable(true /* tbody */, false /* thead */, true /* tfoot */), 1, 1, 2, 2, [
                '#table_0>TBODY> tr:nth-child(2)>TD:nth-child(2)',
                '#table_0>TBODY> tr:nth-child(2)>TD:nth-child(2) *',
                '#table_0>TFOOT> tr:nth-child(1)>TD:nth-child(2)',
                '#table_0>TFOOT> tr:nth-child(1)>TD:nth-child(2) *',
            ]);
        });

        it('Select Table Cells THEAD, TBODY, TFOOT', () => {
            runTest(buildTable(true /* tbody */, true /* thead */, true /* tfoot */), 1, 1, 1, 4, [
                '#table_0>THEAD> tr:nth-child(2)>TD:nth-child(2)',
                '#table_0>THEAD> tr:nth-child(2)>TD:nth-child(2) *',
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2)',
                '#table_0>TBODY> tr:nth-child(1)>TD:nth-child(2) *',
                '#table_0>TBODY> tr:nth-child(2)>TD:nth-child(2)',
                '#table_0>TBODY> tr:nth-child(2)>TD:nth-child(2) *',
                '#table_0>TFOOT> tr:nth-child(1)>TD:nth-child(2)',
                '#table_0>TFOOT> tr:nth-child(1)>TD:nth-child(2) *',
            ]);
        });

        it('Select Table Cells THEAD, TFOOT', () => {
            runTest(buildTable(false /* tbody */, true /* thead */, true /* tfoot */), 1, 1, 1, 2, [
                '#table_0>THEAD> tr:nth-child(2)>TD:nth-child(2)',
                '#table_0>THEAD> tr:nth-child(2)>TD:nth-child(2) *',
                '#table_0>TFOOT> tr:nth-child(1)>TD:nth-child(2)',
                '#table_0>TFOOT> tr:nth-child(1)>TD:nth-child(2) *',
            ]);
        });

        it('Select All', () => {
            runTest(buildTable(true /* tbody */, false, false), 0, 0, 1, 1, [
                '#table_0',
                '#table_0 *',
            ]);
        });
    });
});

function buildTable(tbody: boolean, thead: boolean = false, tfoot: boolean = false) {
    const getElement = (tag: string) => {
        const container = document.createElement(tag);
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const tr2 = document.createElement('tr');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');

        td1.appendChild(document.createTextNode('test'));
        td2.appendChild(document.createTextNode('test'));
        tr1.appendChild(td1);
        tr1.appendChild(td2);

        td3.appendChild(document.createTextNode('test'));
        td4.appendChild(document.createTextNode('test'));
        tr2.appendChild(td3);
        tr2.appendChild(td4);

        container.appendChild(tr1);
        container.appendChild(tr2);

        return container;
    };

    const children: HTMLElement[] = [];
    if (thead) {
        children.push(getElement('thead'));
    }
    if (tbody) {
        children.push(getElement('tbody'));
    }
    if (tfoot) {
        children.push(getElement('tfoot'));
    }
    if (children.length === 0) {
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const tr2 = document.createElement('tr');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');

        td1.appendChild(document.createTextNode('test'));
        td2.appendChild(document.createTextNode('test'));
        tr1.appendChild(td1);
        tr1.appendChild(td2);

        td3.appendChild(document.createTextNode('test'));
        td4.appendChild(document.createTextNode('test'));
        tr2.appendChild(td3);
        tr2.appendChild(td4);

        children.push(tr1, tr2);
    }

    const table = document.createElement('table');

    children.forEach(node => {
        table.appendChild(node);
    });

    return table;
}
