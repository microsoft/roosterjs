import * as TableCellSelectionFile from '../../lib/plugins/TableCellSelection/mouseUtils/handleMouseDownEvent';
import { Browser } from 'roosterjs-editor-dom';
import { DeleteTableContents } from '../../lib/plugins/TableCellSelection/features/DeleteTableContents';
import { Editor } from 'roosterjs-editor-core';
import { IEditor } from 'roosterjs-editor-types';
import { TableCellSelection } from '../../lib/TableCellSelection';
import {
    Coordinates,
    EditorOptions,
    Keys,
    PluginEventType,
    PluginKeyboardEvent,
    SelectionRangeTypes,
    TableSelection,
    TableSelectionRange,
} from 'roosterjs-editor-types';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

describe('TableCellSelectionPlugin |', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let targetId = 'tableSelectionTestId';
    let targetId2 = 'tableSelectionTestId2';
    let tableCellSelection: TableCellSelection;

    beforeEach(() => {
        let node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);
        tableCellSelection = new TableCellSelection();

        let options: EditorOptions = {
            plugins: [tableCellSelection],
            defaultFormat: {
                fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                fontSize: '11pt',
                textColor: '#000000',
            },
            corePluginOverride: {},
        };

        editor = new Editor(node as HTMLDivElement, options);

        editor.runAsync = callback => {
            callback(editor);
            return null;
        };
    });

    afterEach(() => {
        editor.dispose();
        editor = null;
        const div = document.getElementById(id);
        div.parentNode.removeChild(div);
    });

    function initTableSelection(target: HTMLElement) {
        let target2 = target.nextElementSibling as HTMLElement;
        const newRange = new Range();
        newRange.setStart(target, 0);
        newRange.setEnd(target, 0);

        simulateMouseEvent('mousedown', target);

        editor.select(newRange);

        simulateMouseEvent('mousemove', target);

        newRange.setStart(target, 0);
        newRange.setEnd(target2, 0);
        editor.select(newRange);

        simulateMouseEvent('mousemove', target2);
    }

    function runTest(
        content: string,
        expectRangeCallback?: () => Range[] | undefined,
        expectedSelectionType?: SelectionRangeTypes
    ) {
        //Arrange
        editor.setContent(content);
        const target = document.getElementById(targetId);
        const target2 = document.getElementById(targetId2);

        //Act
        editor.focus();
        initTableSelection(target);
        simulateMouseEvent('mousemove', target2);

        //Assert
        simulateMouseEvent('mouseup', target2);
        const selection = editor.getSelectionRangeEx();
        if (expectRangeCallback) {
            expect(selection.ranges).toEqual(expectRangeCallback());
        }
        expect(selection.type).toBe(expectedSelectionType);
        expect(selection.areAllCollapsed).toBe(false);
    }

    it('getName', () => {
        expect(tableCellSelection.getName()).toBe('TableCellSelection');
    });

    describe('Mouse Events |', () => {
        it('Should not convert to Table Selection', () => {
            //Arrange
            editor.setContent(
                `<table><tr ><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table>`
            );
            const target = document.getElementById(targetId);

            //Act
            editor.focus();
            const newRange = new Range();
            newRange.setStart(target, 0);
            newRange.setEnd(target, 1);
            simulateMouseEvent('mousedown', target);
            editor.select(newRange);
            simulateMouseEvent('mousemove', target);
            newRange.setStart(target, 0);
            newRange.setEnd(target, 1);
            editor.select(newRange);
            simulateMouseEvent('mousemove', target);

            //Assert
            const selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.Normal);
            expect(selection.areAllCollapsed).toBe(false);
        });

        it('Should convert to Table Selection', () => {
            //Arrange
            editor.setContent(
                `<table><tr ><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table>`
            );
            const target = document.getElementById(targetId);

            //Act
            editor.focus();
            initTableSelection(target);

            //Assert
            const selection = editor.getSelectionRangeEx();
            const target2 = document.getElementById(targetId2);
            const expectRange = new Range();
            expectRange.setStart(target, 0);
            expectRange.setEndAfter(target2);

            expect(selection.ranges).toEqual([expectRange]);
            expect(selection.type).toBe(SelectionRangeTypes.TableSelection);
            expect(selection.areAllCollapsed).toBe(false);
        });

        it('Selection inside of table 2', () => {
            runTest(
                `<div><br></div><div><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr ><td ><br></td><td id=${targetId} >fsad fasd</td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td id=${targetId2} ><br></td><td ><br></td></tr></tbody></table></div><div><br></div>`,
                () => {
                    const table = editor.queryElements('table')[0];
                    const result: Range[] = [];
                    Array.from(table.rows).forEach(row => {
                        const tempRange = new Range();
                        tempRange.setStart(row, 1);
                        tempRange.setEnd(row, 3);
                        result.push(tempRange);
                    });
                    return result;
                },
                SelectionRangeTypes.TableSelection
            );
        });

        it('Selection inside of table 3', () => {
            runTest(
                `<div><br></div><div><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr ><td ><br></td><td id=${targetId} >fsad fasd</td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td  id=${targetId2} ><br></td></tr></tbody></table></div><div><br></div>`,
                () => {
                    const table = editor.queryElements('table')[0];
                    const result: Range[] = [];
                    Array.from(table.rows).forEach(row => {
                        const tempRange = new Range();
                        tempRange.setStart(row, 1);
                        tempRange.setEnd(row, 4);
                        result.push(tempRange);
                    });
                    return result;
                },
                SelectionRangeTypes.TableSelection
            );
        });

        it('Selection inside of table with table with color 1', () => {
            runTest(
                `<table><tr ><td style="background-color: rgba(35, 35, 35);"  id=${targetId}>a</td><td style="background-color: rgba(35, 35, 35);" id=${targetId2}>w</td></tr></table>`,
                () => {
                    const table = editor.queryElements('table')[0];
                    const result: Range[] = [];
                    Array.from(table.rows).forEach(row => {
                        const tempRange = new Range();
                        tempRange.setStart(row, 0);
                        tempRange.setEnd(row, 2);
                        result.push(tempRange);
                    });
                    return result;
                },
                SelectionRangeTypes.TableSelection
            );
        });

        it('Selection inside of table with table with color 2', () => {
            runTest(
                `<div><table cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td id=${targetId} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td id=${targetId2} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td  style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);">`,
                () => {
                    const table = editor.queryElements('table')[0];
                    const result: Range[] = [];
                    Array.from(table.rows)
                        .filter((t, i) => i < 2)
                        .forEach(row => {
                            const tempRange = new Range();
                            tempRange.setStart(row, 0);
                            tempRange.setEnd(row, 4);
                            result.push(tempRange);
                        });
                    return result;
                },
                SelectionRangeTypes.TableSelection
            );
        });

        it('Selection starts inside of table and ends outside of table', () => {
            runTest(
                `<div><table cellpadding="1" cellspacing="0"><tbody><tr ><td ><br></td><td ><br></td><td id='${targetId}' ><table cellpadding="1" cellspacing="0"><tbody><tr ><td  id="init"><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td></tr></tbody></table><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr></tbody></table></div><div><br></div><div><br></div><div><br></div><div id='${targetId2}'>asdsad</div>`,
                undefined,
                SelectionRangeTypes.Normal
            );
        });

        it('Selection starts outside of table and ends inside of table', () => {
            //Arrange
            editor.setContent(
                `<div><table cellpadding="1" cellspacing="0"><tbody><tr ><td ><br></td><td ><br></td><td id='${targetId2}' ><table cellpadding="1" cellspacing="0"><tbody><tr ><td  id="init"><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td></tr></tbody></table><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr></tbody></table></div><div><br></div><div><br></div><div><br></div><div id='${targetId}'>asdsad</div>`
            );
            const target = document.getElementById(targetId);
            const target2 = document.getElementById(targetId2);

            //Act
            editor.focus();
            const tempRange = new Range();
            tempRange.selectNode(target);
            editor.select(tempRange);
            simulateMouseEvent('mousedown', target);
            simulateMouseEvent('mousemove', target);
            simulateMouseEvent('mousemove', target2);

            //Assert
            simulateMouseEvent('mouseup', target2);
            const selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.Normal);
            expect(selection.areAllCollapsed).toBe(false);
        });

        it('Table Selection from inner table to parent table', () => {
            //Arrange
            editor.setContent(
                `<div><table cellpadding="1" cellspacing="0"><tbody><tr ><td id='${targetId2}' ><br></td><td ><br></td><td id='${targetId}' ><table cellpadding="1" cellspacing="0"><tbody><tr ><td  id="init"><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td></tr></tbody></table><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr></tbody></table><br></div>`
            );
            const target = document.getElementById('init');
            const targetParent = document.getElementById(targetId);
            const target2 = document.getElementById(targetId2);

            //Act
            editor.focus();
            initTableSelection(target);
            simulateMouseEvent('mousemove', targetParent);
            simulateMouseEvent('mousemove', target2);

            //Assert

            const selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.TableSelection);
            expect((<TableSelectionRange>selection).ranges.length).toBe(1);
            expect((<TableSelectionRange>selection).coordinates.firstCell).toEqual({ x: 0, y: 0 });
            expect((<TableSelectionRange>selection).coordinates.lastCell).toEqual({ x: 2, y: 0 });
        });

        it('should not handle selectionInsideTableMouseMove on selecting text', () => {
            editor.setContent(
                '<div id="container"><h2 style="margin:0px 0px 10px;font-family:DauphinPlain;font-size:24px;line-height:24px;text-align:left;background-color:rgb(255, 255, 255)">What is Lorem Ipsum?</h2><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)"><strong style="margin:0px">Lorem Ipsum</strong><span>&nbsp;</span>is simply dummy text of the printing and typesetting industry. .</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,&nbsp;</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">when an unknown printer took a galley of type and scrambled it to make a type&nbsp;</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">specimen book. It has survived not only five centuries, but also the leap into electronic</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">&nbsp;typesetting, remaining essentially unchanged. It was popularised in the 1960s with the</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">&nbsp;release of Letraset sheets containing Lorem Ipsum passages, and more recently with&nbsp;</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><br></div>'
            );
            spyOn(TableCellSelectionFile, 'selectionInsideTableMouseMove').and.callThrough();

            const container = editor.getDocument().getElementById('container');
            simulateMouseEvent('mousedown', container);
            container.querySelectorAll('p').forEach(p => {
                simulateMouseEvent('mousemove', p);
            });

            expect(TableCellSelectionFile.selectionInsideTableMouseMove).toHaveBeenCalledTimes(0);
        });

        it('Shift + Mouse Move scenario', () => {
            //Arrange
            editor.setContent(
                `<div><br></div><div><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr ><td ><br></td><td id=${targetId} >fsad fasd</td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td id=${targetId2} ><br></td><td ><br></td></tr></tbody></table></div><div><br></div>`
            );
            const target = document.getElementById(targetId);
            const target2 = document.getElementById(targetId2);

            //Act
            editor.focus();
            simulateMouseEvent('mousedown', target);
            simulateMouseEvent('mousemove', target);
            simulateMouseEvent('mouseup', target);

            editor.runAsync = callback => {
                const tRange = new Range();
                tRange.setStart(target, 0);
                tRange.setEnd(target2, 0);
                editor.select(tRange);
                callback(editor);
                return null;
            };

            simulateMouseEvent('mousedown', target2, true);
            simulateMouseEvent('mouseup', target2, true);

            //Assert
            const selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.TableSelection);
            expect((<TableSelectionRange>selection).coordinates).toEqual({
                firstCell: { x: 1, y: 0 },
                lastCell: { x: 2, y: 3 },
            });
            expect(selection.areAllCollapsed).toBe(false);
        });
    });

    describe('Key Events |', () => {
        function runKeyDownTest(
            which: { whichInput: number; shiftKey?: boolean; ctrlKey?: boolean },
            expectInput: TableSelection,
            startCoordinates?: Coordinates,
            expectType?: SelectionRangeTypes
        ) {
            const { whichInput, ctrlKey, shiftKey } = which;
            //Arrange
            setup(startCoordinates);

            //Assert
            editor.triggerPluginEvent(PluginEventType.KeyDown, {
                rawEvent: simulateKeyDownEvent(whichInput, shiftKey, ctrlKey),
                eventDataCache: {},
            });

            const selection = editor.getSelectionRangeEx();

            expect((<TableSelectionRange>selection).coordinates).toEqual(expectInput);
            expect(selection.type).toEqual(expectType ?? SelectionRangeTypes.TableSelection);
            expect(selection.areAllCollapsed).toBe(false);
        }

        function runKeyUpTest(
            which: { whichInput: number; shiftKey?: boolean; ctrlKey?: boolean },
            expectInput: TableSelection,
            startCoordinates?: Coordinates,
            expectType?: SelectionRangeTypes,
            areAllCollapsed?: boolean
        ) {
            const { whichInput, ctrlKey, shiftKey } = which;
            //Arrange
            setup(startCoordinates);

            //Assert
            editor.triggerPluginEvent(PluginEventType.KeyUp, {
                rawEvent: simulateKeyDownEvent(whichInput, shiftKey, ctrlKey),
                eventDataCache: {},
            });

            const selection = editor.getSelectionRangeEx();

            expect((<TableSelectionRange>selection)?.coordinates ?? undefined).toEqual(expectInput);
            expect(selection.type).toEqual(expectType ?? SelectionRangeTypes.TableSelection);
            expect(selection.areAllCollapsed).toBe(areAllCollapsed);
        }

        function setup(startCoordinates: Coordinates) {
            editor.setContent(
                `<div><table cellspacing="0" cellpadding="1"><tbody><tr ><td id=${targetId} ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td  ><br></td></tr><tr ><td ><br></td><td ><br></td><td id=${targetId2} ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td >`
            );

            const target = document.getElementById(targetId);
            const target2 = startCoordinates
                ? (document.querySelector(
                      `table tr:nth-child(${startCoordinates.y + 1}) td:nth-child(${
                          startCoordinates.x + 1
                      })`
                  ) as HTMLElement)
                : document.getElementById(targetId2);

            //Act
            editor.focus();
            initTableSelection(target);
            simulateMouseEvent('mousemove', target2);
            simulateMouseEvent('mouseup', target2);
        }

        it('Should not convert to Table Selection', () => {
            //Arrange
            editor.setContent(
                `<table><tr ><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table>`
            );
            const target = document.getElementById(targetId);

            //Act
            editor.focus();
            const newRange = new Range();
            newRange.setStart(target, 0);
            newRange.setEnd(target, 1);

            editor.triggerPluginEvent(PluginEventType.KeyDown, {
                rawEvent: simulateKeyDownEvent(Keys.RIGHT),
                eventDataCache: {},
            });
            editor.select(newRange);
            editor.triggerPluginEvent(PluginEventType.KeyDown, {
                rawEvent: simulateKeyDownEvent(Keys.RIGHT),
                eventDataCache: {},
            });
            newRange.setStart(target, 0);
            newRange.setEnd(target, 1);
            editor.select(newRange);
            editor.triggerPluginEvent(PluginEventType.KeyDown, {
                rawEvent: simulateKeyDownEvent(Keys.RIGHT),
                eventDataCache: {},
            });

            //Assert
            const selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.Normal);
            expect(selection.areAllCollapsed).toBe(false);
        });

        it('Selection using Keyboard RIGHT', () => {
            runKeyDownTest({ whichInput: Keys.RIGHT }, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 3, y: 2 },
            } as TableSelection);
        });

        it('Selection using Keyboard RIGHT at last cell of row', () => {
            runKeyDownTest(
                { whichInput: Keys.RIGHT },
                {
                    firstCell: { x: 0, y: 0 },
                    lastCell: { x: 3, y: 3 },
                } as TableSelection,
                {
                    x: 3,
                    y: 2,
                }
            );
        });

        it('Selection using Keyboard LEFT', () => {
            runKeyDownTest({ whichInput: Keys.LEFT }, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 2 },
            } as TableSelection);
        });

        it('Selection using Keyboard LEFT at first cell of row', () => {
            runKeyDownTest(
                { whichInput: Keys.LEFT },
                {
                    firstCell: { x: 0, y: 0 },
                    lastCell: { x: 0, y: 2 },
                } as TableSelection,
                {
                    x: 0,
                    y: 3,
                }
            );
        });

        it('Selection using Keyboard UP', () => {
            runKeyDownTest({ whichInput: Keys.UP }, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 2, y: 1 },
            } as TableSelection);
        });

        it('Selection using Keyboard UP on first Row', () => {
            runKeyDownTest(
                { whichInput: Keys.UP },
                undefined,
                {
                    x: 0,
                    y: 0,
                },
                SelectionRangeTypes.Normal
            );
        });

        it('Selection using Keyboard DOWN', () => {
            runKeyDownTest({ whichInput: Keys.DOWN }, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 2, y: 3 },
            } as TableSelection);
        });

        it('Selection using Keyboard DOWN on last Row', () => {
            runKeyDownTest(
                { whichInput: Keys.DOWN },
                undefined,
                {
                    x: 0,
                    y: 3,
                },
                SelectionRangeTypes.Normal
            );
        });

        it('Selection using Keyboard DOWN on last Row and use DOWN Key again', () => {
            runKeyDownTest(
                { whichInput: Keys.DOWN },
                undefined,
                {
                    x: 0,
                    y: 3,
                },
                SelectionRangeTypes.Normal
            );

            editor.triggerPluginEvent(PluginEventType.KeyDown, {
                rawEvent: simulateKeyDownEvent(Keys.DOWN),
                eventDataCache: {},
            });

            const selection = editor.getSelectionRangeEx();
            expect(selection.type).toEqual(SelectionRangeTypes.Normal);
        });

        it('Selection using Keyboard SHIFT', () => {
            runKeyDownTest(
                { whichInput: Keys.SHIFT, shiftKey: true },
                { firstCell: { x: 0, y: 0 }, lastCell: { x: 2, y: 2 } }
            );
        });

        it('preventDefault when still selecting', () => {
            //Arrange
            spyOn(TableCellSelectionFile, 'selectionInsideTableMouseMove').and.callThrough();
            editor.setContent(
                `<table><tr ><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table>`
            );
            const target = document.getElementById(targetId);
            const target2 = document.getElementById(targetId2);

            //Act
            editor.focus();
            initTableSelection(target);
            const rawEvent = simulateKeyDownEvent(38);

            //Assert
            editor.triggerPluginEvent(PluginEventType.KeyDown, {
                rawEvent,
                eventDataCache: {},
            });

            simulateMouseEvent('mouseup', target2);

            //Assert
            expect(rawEvent.defaultPrevented).toEqual(true);
        });

        it('Handle key up should clear state', () => {
            runKeyUpTest(
                { whichInput: 38, shiftKey: false },
                undefined,
                null,
                SelectionRangeTypes.Normal,
                true
            );
        });

        it('Handle key up should not clear state', () => {
            runKeyUpTest(
                { whichInput: Keys.DOWN, shiftKey: true },
                {
                    firstCell: { x: 0, y: 0 },
                    lastCell: { x: 2, y: 2 },
                } as TableSelection,
                null,
                SelectionRangeTypes.TableSelection,
                false
            );
        });
    });

    describe('ShadowEdit Event |', () => {
        it('Shadow Edit on Table Selection', () => {
            //Arrange
            editor.setContent(
                `<div><table cellspacing="0" cellpadding="1"><tbody><tr ><td id=${targetId} ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td  ><br></td></tr><tr ><td ><br></td><td ><br></td><td id=${targetId2} ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td >`
            );
            const table = editor.queryElements('table')[0];

            editor.focus();
            editor.select(table, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 3, y: 2 },
            } as TableSelection);

            editor.startShadowEdit();

            let selection = editor.getSelectionRangeEx();
            expect(selection.type).toEqual(SelectionRangeTypes.TableSelection);
            expect(selection.areAllCollapsed).toBe(false);
            expect(selection.ranges.length).toBe(3);

            editor.stopShadowEdit();

            selection = editor.getSelectionRangeEx();
            expect(selection.type).toEqual(SelectionRangeTypes.TableSelection);
            expect(selection.areAllCollapsed).toBe(false);
            expect(selection.ranges.length).toBe(3);
        });

        it('Shadow Edit after performing a selection that starts inside of a table and end outside of a table', () => {
            runTest(
                `<div><table cellpadding="1" cellspacing="0"><tbody><tr ><td ><br></td><td ><br></td><td id='${targetId}' ><table cellpadding="1" cellspacing="0"><tbody><tr ><td  id="init"><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td></tr></tbody></table><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr><tr ><td ><br></td><td ><br></td><td ><br></td><td ><br></td></tr></tbody></table></div><div><br></div><div><br></div><div><br></div><div id='${targetId2}'>asdsad</div>`,
                undefined,
                SelectionRangeTypes.Normal
            );
            editor.startShadowEdit();
            let selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.Normal);

            editor.stopShadowEdit();
            selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.Normal);
        });
    });

    it('DeleteTableContents Feature', () => {
        //Arrange
        editor.setContent(
            `<div><table id='table1' cellspacing="0" cellpadding="1"><tbody><tr ><td id=${targetId} >Test string<br></td><td >Test string<br></td><td >Test string<br></td><td >Test string<br></td></tr><tr ><td >Test string<br></td><td >Test string<br></td><td >Test string<br></td><td  >Test string<br></td></tr><tr ><td >Test string<br></td><td >Test string<br></td><td id=${targetId2} >Test string<br></td><td >Test string<br></td></tr><tr ><td >Test string<br></td><td >Test string<br></td><td >Test string<br></td><td >`
        );

        const table = editor.getDocument().getElementById('table1') as HTMLTableElement;

        editor.select(table, {
            firstCell: { x: 0, y: 0 },
            lastCell: { x: 3, y: 3 },
        } as TableSelection);

        const shouldHandle = DeleteTableContents.shouldHandleEvent(
            <PluginKeyboardEvent>{},
            editor,
            false
        );

        DeleteTableContents.handleEvent(<PluginKeyboardEvent>{}, editor);

        expect(shouldHandle).toBeTrue();

        table.querySelectorAll('td').forEach(cell => {
            expect(cell.childElementCount).toEqual(1);
            expect(cell.firstElementChild?.tagName).toEqual('BR');
        });
    });
});

function simulateMouseEvent(type: string, target: HTMLElement, shiftKey: boolean = false) {
    const rect = target.getBoundingClientRect();
    var event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left,
        clientY: rect.top,
        shiftKey,
    });
    target.dispatchEvent(event);
}

function simulateKeyDownEvent(
    whichInput: number,
    shiftKey: boolean = true,
    ctrlKey: boolean = false
) {
    const evt = new KeyboardEvent('keydown', {
        shiftKey,
        altKey: false,
        ctrlKey,
        cancelable: true,
        which: whichInput,
    });

    if (!Browser.isFirefox) {
        //Chromium hack to add which to the event as there is a bug in Webkit
        //https://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
        Object.defineProperty(evt, 'which', {
            get: function () {
                return whichInput;
            },
        });
    }
    return evt;
}
