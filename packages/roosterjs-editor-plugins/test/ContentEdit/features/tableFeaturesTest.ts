import * as setIndentation from 'roosterjs-editor-api/lib/format/setIndentation';
import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { Browser, cacheGetEventData } from 'roosterjs-editor-dom';
import { TableFeatures } from '../../../lib/plugins/ContentEdit/features/tableFeatures';
import {
    IEditor,
    PluginEventType,
    PluginKeyboardEvent,
    Indentation,
    TableSelection,
} from 'roosterjs-editor-types';

describe('TableFeature', () => {
    let editor: IEditor;
    let table: HTMLTableElement | null;
    const TEST_ID = 'TableFeatureTests';
    const TEST_ELEMENT_ID = 'test';
    const getKeyboardEvent = (shiftKey: boolean) =>
        new KeyboardEvent('keydown', {
            shiftKey,
            altKey: false,
            ctrlKey: false,
        });
    let keyboardEvent: PluginKeyboardEvent;
    let shiftKeyboardEvent: PluginKeyboardEvent;

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        editor.setContent(
            `<table id="${TEST_ELEMENT_ID}"><tr><td>Text1</td><td>Text2</td></tr><tr><td>Text3</td><td>Text4</td></tr></table>`
        );
        editor.focus();
        table = editor.getDocument().getElementById(TEST_ELEMENT_ID) as HTMLTableElement;
        const td = table.querySelector('td,th');
        editor.select(td!, 0);
        keyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };
        shiftKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(true),
        };
    });

    afterEach(() => {
        TestHelper.removeElement(TEST_ID);
        let element = document.getElementById(TEST_ELEMENT_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    describe('tabInTable |', () => {
        const feature = TableFeatures.tabInTable;

        describe('ShouldHandle |', () => {
            it('Should not handle, is not in a table', () => {
                editor.setContent(`<span id="${TEST_ELEMENT_ID}"><span>`);
                editor.focus();
                editor.select(document.getElementById('TEST_ELEMENT_ID')!, 0);
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
            it('Should not handle, table is fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
            it('Should handle, table is not fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 0, x: 1 },
                });
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeTruthy();
            });
        });
        describe('HandleEvent |', () => {
            function runTest(shift: boolean, cellSelected: number, expectedTargetCell: number) {
                const event = shift ? shiftKeyboardEvent : keyboardEvent;
                let cells = table?.querySelectorAll('td,th')!;
                const target = cells[cellSelected]!;
                let expectedCell = cells[expectedTargetCell] || undefined;

                editor.select(target, 0);

                feature.handleEvent(event, editor);

                const focusedPos = editor.getFocusedPosition();
                if (!expectedCell) {
                    cells = table?.querySelectorAll('td,th')!;
                    expectedCell = cells[expectedTargetCell];
                }
                expect(focusedPos.element).toBe(expectedCell! as HTMLElement);
            }
            it('1st cell to 2nd cell', () => {
                runTest(false, 0, 1);
            });
            it('2nd cell to 3rd cell', () => {
                runTest(false, 1, 2);
            });
            it('3rd cell to 2nd cell', () => {
                runTest(true, 2, 1);
            });
            it('2nd cell to 1st cell', () => {
                runTest(true, 1, 0);
            });
            it('Shift + Tab in 1st cell', () => {
                const event = shiftKeyboardEvent;
                let cells = table?.querySelectorAll('td,th')!;
                const target = cells[0]!;

                editor.select(target, 0);
                feature.handleEvent(event, editor);

                const focusedPos = editor.getFocusedPosition();
                expect(focusedPos.node).toBe(table?.parentNode);
            });
            it('Tab in last cell to create new row', () => {
                runTest(false, 3, 4);
            });
        });
    });

    describe('indentTableOnTab |', () => {
        const feature = TableFeatures.indentTableOnTab;

        describe('ShouldHandle', () => {
            it('Should not handle, is not in a table', () => {
                editor.setContent(`<span id="${TEST_ELEMENT_ID}"><span>`);
                editor.focus();
                editor.select(document.getElementById('TEST_ELEMENT_ID')!, 0);
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
            it('Should handle, table is fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeTruthy();
            });
            it('Should not handle, table is not fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 0, x: 1 },
                });
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
        });

        describe('HandleEvent', () => {
            let setIndentationFn: jasmine.Spy;

            beforeEach(() => {
                setIndentationFn = spyOn(setIndentation, 'default');
            });

            function runTest(shift: boolean, setIndentationExpect?: () => void) {
                const event = shift ? shiftKeyboardEvent : keyboardEvent;

                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });

                feature.handleEvent(event, editor);

                if (!setIndentationExpect) {
                    expect(setIndentationFn).toHaveBeenCalled();
                    expect(setIndentationFn).toHaveBeenCalledWith(
                        editor,
                        shift ? Indentation.Decrease : Indentation.Increase
                    );
                } else {
                    setIndentationExpect();
                }
            }
            it('Indent Whole Table selected', () => {
                runTest(false);
            });

            it('Outdent Whole Table selected', () => {
                editor.setContent(
                    `<blockquote><table id="${TEST_ELEMENT_ID}"><tr><td>Text</td><td>Text</td></tr><tr><td>Text</td><td>Text</td></tr></table></blockquote>`
                );
                editor.focus();
                table = editor.getDocument().getElementById(TEST_ELEMENT_ID) as HTMLTableElement;
                const td = table.querySelector('td,th');
                editor.select(td!, 0);
                runTest(true);
            });

            it('Outdent Whole Table selected, but is not going to be executed because table is not wrapped in a blockquote', () => {
                runTest(true, () => {
                    expect(setIndentationFn).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('UpDownInTable |', () => {
        const feature = TableFeatures.upDownInTable;

        describe('ShouldHandle |', () => {
            it('Should not handle, is not in a table', () => {
                editor.setContent(`<span id="${TEST_ELEMENT_ID}"><span>`);
                editor.focus();
                editor.select(document.getElementById('TEST_ELEMENT_ID')!, 0);
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
            it('Should not handle, table is fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
            it('Should handle, table is not fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 0, x: 1 },
                });
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeTruthy();
            });
        });

        describe('HandleEvent', () => {
            beforeEach(() => {
                editor.runAsync = callback => {
                    callback(editor);
                    return () => {};
                };
            });

            function getKeyboardUpDownEvent(isUp: boolean, shiftKey: boolean = false) {
                const which = isUp ? 38 /* UP */ : 40; /* Down */
                const evt = new KeyboardEvent('keydown', {
                    shiftKey,
                    altKey: false,
                    ctrlKey: false,
                    cancelable: true,
                    which,
                });

                if (!Browser.isFirefox) {
                    //Chromium hack to add which to the event as there is a bug in Webkit
                    //https://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
                    Object.defineProperty(evt, 'which', {
                        get: function () {
                            return which;
                        },
                    });
                }
                return evt;
            }

            function runTest(isUp: boolean, cellSelected: number, expectedTargetCell: number) {
                const pluginEvent: PluginKeyboardEvent = {
                    eventType: PluginEventType.KeyDown,
                    rawEvent: getKeyboardUpDownEvent(isUp),
                };

                const cells = table?.querySelectorAll('td,th')!;
                const target = cells[cellSelected]!;
                const expectedCell = cells[expectedTargetCell] || undefined;

                spyOn(editor, 'getElementAtCursor').and.returnValue(expectedCell as HTMLElement);
                const range = new Range();
                range.setStart(target, 0);

                window.getSelection()?.removeAllRanges();
                window.getSelection()?.addRange(range);

                feature.handleEvent(pluginEvent, editor);

                expect(editor.getElementAtCursor()).toBe(expectedCell as HTMLElement);
            }

            function runTestWithShift(
                isUp: boolean,
                cellSelected: number,
                expectedTargetCell: number
            ) {
                const pluginEvent: PluginKeyboardEvent = {
                    eventType: PluginEventType.KeyDown,
                    rawEvent: getKeyboardUpDownEvent(isUp, true),
                };

                const cells = table?.querySelectorAll('td,th')!;
                const target = cells[cellSelected]!;
                const expectedCell = cells[expectedTargetCell] || undefined;

                spyOn(editor, 'getElementAtCursor').and.returnValue(expectedCell as HTMLElement);
                cacheGetEventData(pluginEvent, 'TABLE_CELL_FOR_TABLE_FEATURES', () => {
                    return target;
                });

                editor.select(target, 0);

                feature.handleEvent(pluginEvent, editor);

                const selection = window.getSelection();
                expect(selection!.getRangeAt(0).collapsed).toBe(false);
            }
            it('Use DOWN on first cell', () => {
                runTest(false, 0, 2);
            });
            it('Use DOWN on second cell', () => {
                runTest(false, 1, 3);
            });
            it('Use UP on third cell', () => {
                runTest(true, 2, 0);
            });
            it('Use UP on fourth cell', () => {
                runTest(true, 3, 1);
            });
            it('Use UP on fourth cell', () => {
                runTest(true, 3, 1);
            });
            it('Shift Use UP on fourth cell', () => {
                runTestWithShift(true, 3, 1);
            });
            it('Shift Use DOWN on fourth cell', () => {
                runTestWithShift(false, 3, 1);
            });
            it('Shift Use DOWN on fourth cell', () => {
                runTestWithShift(false, 2, 0);
            });
        });
    });

    describe('deleteTable | ', () => {
        const feature = TableFeatures.deleteTableWithBackspace;

        describe('ShouldHandle', () => {
            it('Should not handle, is not in a table', () => {
                editor.setContent(`<span id="${TEST_ELEMENT_ID}"><span>`);
                editor.focus();
                editor.select(document.getElementById('TEST_ELEMENT_ID')!, 0);
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
            it('Should handle, table is fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });
                spyOn(editor, 'isFeatureEnabled').and.returnValue(true);
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeTruthy();
            });
            it('Should not handle, table is not fully selected', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 0, x: 1 },
                });
                const shouldHandleEvent = feature.shouldHandleEvent(keyboardEvent, editor, false);
                expect(!!shouldHandleEvent).toBeFalsy();
            });
        });

        describe('HandleEvent', () => {
            it('Should delete table', () => {
                editor.select(table!, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });

                feature.handleEvent(keyboardEvent, editor);
                const deletedTable = document.getElementById('TEST_ELEMENT_ID');
                expect(deletedTable).toBe(null);
            });
        });
    });
});
