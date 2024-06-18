import * as addRangeToSelection from '../../../lib/coreApi/setDOMSelection/addRangeToSelection';
import { DOMSelection, EditorCore } from 'roosterjs-content-model-types';
import { setDOMSelection } from '../../../lib/coreApi/setDOMSelection/setDOMSelection';
import {
    DEFAULT_SELECTION_BORDER_COLOR,
    DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
} from '../../../lib/corePlugin/selection/SelectionPlugin';

const DEFAULT_DARK_COLOR_SUFFIX_COLOR = 'DarkColorMock-';
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
    let createElementSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;

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
        appendChildSpy = jasmine.createSpy('appendChild');
        createElementSpy = jasmine.createSpy('createElement').and.returnValue({
            appendChild: appendChildSpy,
        });
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');

        doc = {
            querySelectorAll: querySelectorAllSpy,
            createRange: createRangeSpy,
            contains: containsSpy,
            createElement: createElementSpy,
        } as any;
        contentDiv = {
            ownerDocument: doc,
        } as any;

        core = {
            physicalRoot: contentDiv,
            logicalRoot: contentDiv,
            selection: {
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            },
            api: {
                triggerEvent: triggerEventSpy,
                setEditorStyle: setEditorStyleSpy,
                getDOMSelection: getDOMSelectionSpy,
            },
            domHelper: {
                hasFocus: hasFocusSpy,
            },
            lifecycle: {
                isDarkMode: false,
            },
            environment: {
                isSafari: false,
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(3);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            } as any);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(3);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            } as any);
            expect(triggerEventSpy).not.toHaveBeenCalled();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange, false);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(3);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(3);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
        });
    });

    describe('Image selection', () => {
        let mockedImage: HTMLImageElement;
        beforeEach(() => {
            mockedImage = {
                parentElement: {
                    ownerDocument: doc,
                    firstElementChild: mockedImage,
                    lastElementChild: mockedImage,
                    appendChild: appendChildSpy,
                },
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            expect(collapseSpy).not.toHaveBeenCalledWith();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange, undefined);
            expect(mockedImage.id).toBe('image_0');
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(5);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:solid!important; outline-color:#DB626C!important;display: inline-flex;',
                ['span:has(>img#image_0)']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                'background-color: transparent !important;',
                ['*::selection']
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
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            expect(collapseSpy).not.toHaveBeenCalledWith();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange, undefined);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(5);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:solid!important; outline-color:red!important;display: inline-flex;',
                ['span:has(>img#image_0)']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                'background-color: transparent !important;',
                ['*::selection']
            );
        });

        it('image selection with customized selection border color and dark mode', () => {
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
            const coreValue = { ...core, lifecycle: { isDarkMode: true } as any };

            coreValue.selection.imageSelectionBorderColor = 'red';
            coreValue.selection.imageSelectionBorderColorDark = `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}red`;

            createRangeSpy.and.returnValue(mockedRange);

            querySelectorAllSpy.and.returnValue([]);
            hasFocusSpy.and.returnValue(false);

            setDOMSelection(coreValue, mockedSelection);

            expect(coreValue.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: mockedSelection,
                imageSelectionBorderColor: 'red',
                imageSelectionBorderColorDark: `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}red`,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                coreValue,
                {
                    eventType: 'selectionChanged',
                    newSelection: mockedSelection,
                },
                true
            );
            expect(selectNodeSpy).toHaveBeenCalledWith(mockedImage);
            expect(collapseSpy).not.toHaveBeenCalledWith();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange, undefined);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(5);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(coreValue, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                coreValue,
                '_DOMSelectionHideCursor',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                coreValue,
                '_DOMSelectionHideSelection',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                coreValue,
                '_DOMSelection',
                'outline-style:solid!important; outline-color:DarkColorMock-red!important;display: inline-flex;',
                ['span:has(>img#image_0)']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                coreValue,
                '_DOMSelectionHideSelection',
                'background-color: transparent !important;',
                ['*::selection']
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(5);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:solid!important; outline-color:#DB626C!important;display: inline-flex;',
                ['span:has(>img#image_0)']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                'background-color: transparent !important;',
                ['*::selection']
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
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
            expect(collapseSpy).not.toHaveBeenCalledWith();
            expect(addRangeToSelectionSpy).toHaveBeenCalledWith(doc, mockedRange, undefined);
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(5);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'outline-style:solid!important; outline-color:#DB626C!important;display: inline-flex;',
                ['span:has(>img#image_0_0)']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                'background-color: transparent !important;',
                ['*::selection']
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            } as any);
            expect(triggerEventSpy).not.toHaveBeenCalled();
            expect(selectNodeSpy).not.toHaveBeenCalled();
            expect(collapseSpy).not.toHaveBeenCalled();
            expect(addRangeToSelectionSpy).not.toHaveBeenCalled();
            expect(mockedTable.id).toBeUndefined();

            expect(setEditorStyleSpy).toHaveBeenCalledTimes(3);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
        });

        function runTest(
            mockedTable: HTMLTableElement,
            firstColumn: number,
            firstRow: number,
            lastColumn: number,
            lastRow: number,
            result: string[],
            selectionColor?: string,
            expectedDarkSelectionColor?: string
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
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor:
                    selectionColor ?? DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
                ...(expectedDarkSelectionColor
                    ? { tableCellSelectionBackgroundColorDark: expectedDarkSelectionColor }
                    : {}),
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
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(5);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                `background-color:${
                    expectedDarkSelectionColor ??
                    selectionColor ??
                    DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR
                }!important;`,
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

        it('Select TD with double merged cell', () => {
            const div = document.createElement('div');
            div.innerHTML =
                '<table>' +
                '<tr><td colspan=2 rowspan=2></td><td></td><td></td></tr>' +
                '<tr><td></td><td></td></tr>' +
                '<tr><td></td><td></td><td colspan=2 rowspan=2></td></tr>' +
                '<tr><td></td><td></td></tr>' +
                '</table>';
            const table = div.firstChild as HTMLTableElement;

            const mockedSelection = {
                type: 'table',
                table: table,
                firstColumn: 2,
                firstRow: 1,
                lastColumn: 1,
                lastRow: 2,
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

            const resultSelection = {
                type: 'table',
                table: table,
                firstColumn: 0,
                firstRow: 0,
                lastColumn: 3,
                lastRow: 3,
            };

            expect(core.selection).toEqual({
                skipReselectOnFocus: undefined,
                selection: resultSelection,
                imageSelectionBorderColor: DEFAULT_SELECTION_BORDER_COLOR,
                tableCellSelectionBackgroundColor: DEFAULT_TABLE_CELL_SELECTION_BACKGROUND_COLOR,
            } as any);
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'selectionChanged',
                    newSelection: resultSelection,
                },
                true
            );
            expect(table.id).toBe('table_0');
            expect(setEditorStyleSpy).toHaveBeenCalledTimes(5);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelection', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(core, '_DOMSelectionHideCursor', null);
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideSelection',
                null
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelection',
                'background-color:#C6C6C6!important;',
                ['#table_0', '#table_0 *']
            );
            expect(setEditorStyleSpy).toHaveBeenCalledWith(
                core,
                '_DOMSelectionHideCursor',
                'caret-color: transparent'
            );
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

        it('Select All with custom selection color', () => {
            const selectionColor = 'red';
            core.selection.tableCellSelectionBackgroundColor = selectionColor;
            runTest(
                buildTable(true /* tbody */, false, false),
                0,
                0,
                1,
                1,
                ['#table_0', '#table_0 *'],
                selectionColor
            );
        });

        it('Select All with custom selection color and dark mode', () => {
            const selectionColor = 'red';
            const selectionColorDark = `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}red`;
            core.selection.tableCellSelectionBackgroundColor = selectionColor;
            core.selection.tableCellSelectionBackgroundColorDark = selectionColorDark;
            core.lifecycle.isDarkMode = true;
            runTest(
                buildTable(true /* tbody */, false, false),
                0,
                0,
                1,
                1,
                ['#table_0', '#table_0 *'],
                selectionColor,
                selectionColorDark
            );
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
