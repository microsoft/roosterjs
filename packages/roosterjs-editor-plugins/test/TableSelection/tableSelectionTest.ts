import { Editor } from 'roosterjs-editor-core';
import { IEditor } from 'roosterjs-editor-types';
import { TableCellSelection } from '../../lib/TableCellSelection';
import {
    EditorOptions,
    Keys,
    SelectionRangeTypes,
    TableSelectionRange,
    PluginEventType,
    TableSelection,
    Coordinates,
} from 'roosterjs-editor-types';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

describe('TableCellSelectionPlugin | ', () => {
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

    it('getName', () => {
        expect(tableCellSelection.getName()).toBe('TableCellSelection');
    });

    describe(' Mouse Events |', () => {
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
            spyOn(tableCellSelection, 'selectionInsideTableMouseMove').and.callThrough();
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
            expect(tableCellSelection.selectionInsideTableMouseMove).toHaveBeenCalledTimes(2);
        });

        it('Selection inside of table 2', () => {
            runTest(
                `<div><br></div><div><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td id=${targetId} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">fsad fasd</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td id=${targetId2} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table></div><div><br></div>`,
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
                `<div><br></div><div><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td id=${targetId} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">fsad fasd</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td  id=${targetId2} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table></div><div><br></div>`,
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
                `<div><table cellpadding="1" cellspacing="0"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td id='${targetId}' style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><table cellpadding="1" cellspacing="0"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" id="init"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr></tbody></table></div><div><br></div><div><br></div><div><br></div><div id='${targetId2}'>asdsad</div>`,
                undefined,
                SelectionRangeTypes.Normal
            );
        });

        it('Table Selection from inner table to parent table', () => {
            //Arrange
            editor.setContent(
                `<div><table cellpadding="1" cellspacing="0"><tbody><tr style="background-color: rgb(255, 255, 255);"><td id='${targetId2}' style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td id='${targetId}' style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><table cellpadding="1" cellspacing="0"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);" id="init"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);"><br></td></tr></tbody></table><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr></tbody></table><br></div>`
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
    });

    describe(' Key Events |', () => {
        function runKeyTest(
            which: number,
            expectInput: TableSelection,
            startCoordinates?: Coordinates,
            expectType?: SelectionRangeTypes
        ) {
            //Arrange
            spyOn(tableCellSelection, 'selectTable').and.callThrough();
            editor.setContent(
                `<div><table cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td id=${targetId} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td  style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td id=${targetId2} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(200, 150, 100);">`
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

            //Assert
            editor.triggerPluginEvent(PluginEventType.KeyDown, {
                rawEvent: simulateKeyDownEvent(which),
                eventDataCache: {},
            });

            const selection = editor.getSelectionRangeEx();

            expect((<TableSelectionRange>selection).coordinates).toEqual(expectInput);
            expect(selection.type).toEqual(expectType ?? SelectionRangeTypes.TableSelection);
            expect(selection.areAllCollapsed).toBe(false);
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
            runKeyTest(Keys.RIGHT, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 3, y: 2 },
            } as TableSelection);
        });

        it('Selection using Keyboard RIGHT at last cell of row', () => {
            runKeyTest(
                Keys.RIGHT,
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
            runKeyTest(Keys.LEFT, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 1, y: 2 },
            } as TableSelection);
        });

        it('Selection using Keyboard LEFT at first cell of row', () => {
            runKeyTest(
                Keys.LEFT,
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
            runKeyTest(Keys.UP, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 2, y: 1 },
            } as TableSelection);
        });

        it('Selection using Keyboard UP on first Row', () => {
            runKeyTest(
                Keys.UP,
                undefined,
                {
                    x: 0,
                    y: 0,
                },
                SelectionRangeTypes.Normal
            );
        });

        it('Selection using Keyboard DOWN', () => {
            runKeyTest(Keys.DOWN, {
                firstCell: { x: 0, y: 0 },
                lastCell: { x: 2, y: 3 },
            } as TableSelection);
        });

        it('Selection using Keyboard DOWN on last Row', () => {
            runKeyTest(
                Keys.DOWN,
                undefined,
                {
                    x: 0,
                    y: 3,
                },
                SelectionRangeTypes.Normal
            );
        });
    });

    it('should not handle selectionInsideTableMouseMove on selecting text', () => {
        editor.setContent(
            '<div id="container"><h2 style="margin:0px 0px 10px;font-family:DauphinPlain;font-size:24px;line-height:24px;text-align:left;background-color:rgb(255, 255, 255)">What is Lorem Ipsum?</h2><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)"><strong style="margin:0px">Lorem Ipsum</strong><span>&nbsp;</span>is simply dummy text of the printing and typesetting industry. .</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,&nbsp;</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">when an unknown printer took a galley of type and scrambled it to make a type&nbsp;</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">specimen book. It has survived not only five centuries, but also the leap into electronic</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">&nbsp;typesetting, remaining essentially unchanged. It was popularised in the 1960s with the</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">&nbsp;release of Letraset sheets containing Lorem Ipsum passages, and more recently with&nbsp;</p><p style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><br></div>'
        );
        spyOn(tableCellSelection, 'selectionInsideTableMouseMove').and.callThrough();

        const container = editor.getDocument().getElementById('container');
        simulateMouseEvent('mousedown', container);
        container.querySelectorAll('p').forEach(p => {
            simulateMouseEvent('mousemove', p);
        });

        expect(tableCellSelection.selectionInsideTableMouseMove).toHaveBeenCalledTimes(0);
    });
});

function simulateMouseEvent(type: string, target: HTMLElement, point?: { x: number; y: number }) {
    const rect = target.getBoundingClientRect();
    var event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + (point != undefined ? point?.x : 0),
        clientY: rect.top + (point != undefined ? point?.y : 0),
    });
    target.dispatchEvent(event);
}

function simulateKeyDownEvent(whichInput: number, shiftKey = true) {
    return new KeyboardEvent('keydown', {
        shiftKey,
        altKey: false,
        ctrlKey: false,
        cancelable: true,
        which: whichInput,
    });
}
