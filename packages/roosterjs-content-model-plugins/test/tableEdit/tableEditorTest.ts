import { afterTableTest, beforeTableTest, getCellRect, initialize } from './TableEditTestHelper';
import { ContentModelTable, IEditor } from 'roosterjs-content-model-types';
import { getMergedFirstColumnTable, getMergedTopRowTable, getModelTable } from './tableData';
import { TABLE_MOVER_ID } from '../../lib/tableEdit/editors/features/TableMover';
import { TABLE_RESIZER_ID } from '../../lib/tableEdit/editors/features/TableResizer';
import { TableEditFeatureName } from '../../lib/tableEdit/editors/features/TableEditFeatureName';
import { TableEditor } from '../../lib/tableEdit/editors/TableEditor';
import {
    HORIZONTAL_INSERTER_ID,
    VERTICAL_INSERTER_ID,
} from '../../lib/tableEdit/editors/features/TableInserter';
import {
    HORIZONTAL_RESIZER_ID,
    VERTICAL_RESIZER_ID,
} from '../../lib/tableEdit/editors/features/CellResizer';

describe('TableEditor', () => {
    describe('disableFeatures', () => {
        const insideTheOffset = 5;
        let editor: IEditor;
        let table: HTMLTableElement;
        let tEditor: TableEditor;
        const TEST_ID = 'test';

        function runDisableFeatureSetup(
            cmTable: ContentModelTable,
            featuresToDisable: TableEditFeatureName[],
            anchorContainer?: HTMLElement
        ) {
            const setup = beforeTableTest(TEST_ID, undefined, featuresToDisable);
            editor = setup.editor;
            // Give the editor a deterministic size that is larger than the test tables, with
            // padding on every side, so the table is never flush against the scroll container's
            // edges. createTableInserter suppresses the inserter when a cell touches the viewport
            // edge (isOutsideTop/isOutsideBottom); whether that happened otherwise depended on
            // leftover document.body layout from previously-run specs, making this test order
            // dependent (randomly failing).
            const editorDiv = editor.getDocument().getElementById(TEST_ID) as HTMLElement;
            editorDiv.style.height = '400px';
            editorDiv.style.padding = '100px';
            const rect = initialize(editor, cmTable);
            table = editor.getDOMHelper().queryElements('table')[0];
            const contentDiv = editor.getDocument().getElementById(TEST_ID);
            tEditor = new TableEditor(
                editor,
                table,
                null,
                () => {},
                anchorContainer,
                contentDiv,
                undefined,
                featuresToDisable
            );
            return rect;
        }

        /************************ Disable features tests ************************/

        it('Disable Horizontal Inserter', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), ['HorizontalTableInserter']);
            // Move mouse to bottom left of table
            tEditor.onMouseMove(tableRect.left - insideTheOffset, tableRect.bottom);
            const feature = editor.getDocument().getElementById(HORIZONTAL_INSERTER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Vertical Inserter', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), ['VerticalTableInserter']);
            // Move mouse to top right of table
            tEditor.onMouseMove(tableRect.right, tableRect.top - insideTheOffset);
            const feature = editor.getDocument().getElementById(VERTICAL_INSERTER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Horizontal Resizer', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), ['CellResizer']);
            // Move mouse to bottom right of table
            tEditor.onMouseMove(tableRect.right - insideTheOffset, tableRect.bottom);
            const feature = editor.getDocument().getElementById(HORIZONTAL_RESIZER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Vertical Resizer', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), ['CellResizer']);
            // Move mouse to bottom right of table
            tEditor.onMouseMove(tableRect.right, tableRect.bottom - insideTheOffset);
            const feature = editor.getDocument().getElementById(VERTICAL_RESIZER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Table Resizer', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), ['TableResizer']);
            // Move mouse to center of table
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top + tableRect.height / 2
            );
            const feature = editor.getDocument().getElementById(TABLE_RESIZER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Table Mover', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), [
                'TableMover',
                'TableSelector',
            ]);
            // Move mouse to center of table
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top + tableRect.height / 2
            );
            const feature = editor.getDocument().getElementById(TABLE_MOVER_ID);
            expect(!!feature).toBe(false);
        });

        /************************ Table Inserter tests ************************/

        it('Not add table inserter if cursor on top left corner', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), []);
            // Move mouse to top left of table
            tEditor.onMouseMove(tableRect.left - insideTheOffset, tableRect.top - insideTheOffset);
            const featureH = editor.getDocument().getElementById(HORIZONTAL_INSERTER_ID);
            const featureV = editor.getDocument().getElementById(VERTICAL_INSERTER_ID);
            expect(!!featureH).toBe(false);
            expect(!!featureV).toBe(false);
        });

        it('Not add table inserter if cursor on top middle of merged top row', () => {
            const tableRect = runDisableFeatureSetup(getMergedTopRowTable(), []);
            // Move mouse to top middle of table
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top - insideTheOffset
            );
            const featureH = editor.getDocument().getElementById(HORIZONTAL_INSERTER_ID);
            const featureV = editor.getDocument().getElementById(VERTICAL_INSERTER_ID);
            expect(!!featureH).toBe(false);
            expect(!!featureV).toBe(false);
        });

        it('Add table inserter if cursor on left middle of merged first column', () => {
            const tableRect = runDisableFeatureSetup(getMergedFirstColumnTable(), []);
            // Move mouse to left middle of table
            tEditor.onMouseMove(
                tableRect.left - insideTheOffset,
                tableRect.top + tableRect.height / 2
            );
            const featureH = editor.getDocument().getElementById(HORIZONTAL_INSERTER_ID);
            const featureV = editor.getDocument().getElementById(VERTICAL_INSERTER_ID);
            expect(!!featureH).toBe(true);
            expect(!!featureV).toBe(false);
        });

        afterEach(() => {
            afterTableTest(editor, tEditor, TEST_ID);
        });
    });

    describe('public methods and editing lifecycle', () => {
        let editor: IEditor;
        let table: HTMLTableElement;
        let tEditor: TableEditor;
        let onChangedSpy: jasmine.Spy;
        const TEST_ID = 'tableEditorLifecycleTest';

        function setup(cmTable: ContentModelTable = getModelTable(), isRtl: boolean = false) {
            const s = beforeTableTest(TEST_ID);
            editor = s.editor;
            const editorDiv = editor.getDocument().getElementById(TEST_ID) as HTMLElement;
            editorDiv.style.height = '400px';
            editorDiv.style.padding = '100px';
            const rect = initialize(editor, cmTable, isRtl);
            table = editor.getDOMHelper().queryElements('table')[0];
            const contentDiv = editor.getDocument().getElementById(TEST_ID);
            onChangedSpy = jasmine.createSpy('onChanged');
            tEditor = new TableEditor(
                editor,
                table,
                null,
                onChangedSpy,
                undefined,
                contentDiv,
                undefined
            );
            return rect;
        }

        afterEach(() => {
            afterTableTest(editor, tEditor, TEST_ID);
        });

        it('isEditing is false before any editing starts', () => {
            setup();
            expect(tEditor.isEditing()).toBe(false);
        });

        it('onSelect focuses the editor and sets a table selection', () => {
            setup();
            const focusSpy = spyOn(editor, 'focus');
            const setDOMSelectionSpy = spyOn(editor, 'setDOMSelection');

            tEditor.onSelect(table);

            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    type: 'table',
                    table,
                    firstRow: 0,
                    firstColumn: 0,
                }) as any
            );
        });

        it('onSelect only focuses when no table is passed', () => {
            setup();
            const focusSpy = spyOn(editor, 'focus');
            const setDOMSelectionSpy = spyOn(editor, 'setDOMSelection');

            tEditor.onSelect(null as any);

            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('isOwnedElement returns true for a feature element and false for unrelated nodes', () => {
            const tableRect = setup();
            // Hover the center to ensure features are created
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top + tableRect.height / 2
            );

            const mover = editor.getDocument().getElementById(TABLE_MOVER_ID);
            expect(!!mover).toBe(true);
            expect(tEditor.isOwnedElement(mover!)).toBe(true);

            // A child of a feature element is also considered owned
            const child = editor.getDocument().createElement('span');
            mover!.appendChild(child);
            expect(tEditor.isOwnedElement(child)).toBe(true);

            expect(tEditor.isOwnedElement(editor.getDocument().body)).toBe(false);
        });

        it('onFinishEditing restores the saved range, snapshots and reports change', () => {
            setup();
            const focusSpy = spyOn(editor, 'focus');
            const setDOMSelectionSpy = spyOn(editor, 'setDOMSelection');
            const takeSnapshotSpy = spyOn(editor, 'takeSnapshot');
            const mockedRange = { id: 'range' } as any;
            (tEditor as any).range = mockedRange;
            (tEditor as any).isCurrentlyEditing = true;

            const result = (tEditor as any).onFinishEditing();

            expect(result).toBe(false);
            expect(focusSpy).toHaveBeenCalled();
            expect(setDOMSelectionSpy).toHaveBeenCalledWith({
                type: 'range',
                range: mockedRange,
                isReverted: false,
            });
            expect(takeSnapshotSpy).toHaveBeenCalled();
            expect(onChangedSpy).toHaveBeenCalled();
            expect(tEditor.isEditing()).toBe(false);
            expect((tEditor as any).range).toBeNull();
        });

        it('onFinishEditing does not restore selection when there is no saved range', () => {
            setup();
            const setDOMSelectionSpy = spyOn(editor, 'setDOMSelection');
            spyOn(editor, 'takeSnapshot');

            (tEditor as any).range = null;
            (tEditor as any).onFinishEditing();

            expect(setDOMSelectionSpy).not.toHaveBeenCalled();
        });

        it('onStartTableResize saves the current range and marks editing', () => {
            setup();
            const setLogicalRootSpy = spyOn(editor, 'setLogicalRoot');
            const takeSnapshotSpy = spyOn(editor, 'takeSnapshot');
            const mockedRange = { id: 'range' } as any;
            spyOn(editor, 'getDOMSelection').and.returnValue({
                type: 'range',
                range: mockedRange,
            } as any);

            (tEditor as any).onStartTableResize();

            expect(tEditor.isEditing()).toBe(true);
            expect(setLogicalRootSpy).toHaveBeenCalledWith(null);
            expect(takeSnapshotSpy).toHaveBeenCalled();
            expect((tEditor as any).range).toBe(mockedRange);
        });

        it('onStartResize does not save a range when the selection is not a range', () => {
            setup();
            spyOn(editor, 'setLogicalRoot');
            spyOn(editor, 'takeSnapshot');
            spyOn(editor, 'getDOMSelection').and.returnValue({ type: 'image' } as any);

            (tEditor as any).onStartResize();

            expect((tEditor as any).range).toBeNull();
        });

        it('onStartCellResize marks editing and disposes the table resizer', () => {
            setup();
            spyOn(editor, 'setLogicalRoot');
            spyOn(editor, 'takeSnapshot');
            spyOn(editor, 'getDOMSelection').and.returnValue(null as any);

            (tEditor as any).onStartCellResize();

            expect(tEditor.isEditing()).toBe(true);
            expect(editor.getDocument().getElementById(TABLE_RESIZER_ID)).toBeNull();
        });

        it('onStartTableMove marks editing, sets logical root and disposes features', () => {
            const tableRect = setup();
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top + tableRect.height / 2
            );
            const setLogicalRootSpy = spyOn(editor, 'setLogicalRoot');

            (tEditor as any).onStartTableMove();

            expect(tEditor.isEditing()).toBe(true);
            expect(setLogicalRootSpy).toHaveBeenCalledWith(null);
            expect(editor.getDocument().getElementById(TABLE_RESIZER_ID)).toBeNull();
        });

        it('onEndTableMove disposes the mover when requested and finishes editing', () => {
            setup();
            const finishSpy = spyOn(tEditor as any, 'onFinishEditing').and.returnValue(false);
            const disposeMoverSpy = spyOn(tEditor as any, 'disposeTableMover').and.callThrough();

            const result = (tEditor as any).onEndTableMove(true);

            expect(disposeMoverSpy).toHaveBeenCalled();
            expect(finishSpy).toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('onEndTableMove keeps the mover when not requested', () => {
            setup();
            spyOn(tEditor as any, 'onFinishEditing').and.returnValue(false);
            const disposeMoverSpy = spyOn(tEditor as any, 'disposeTableMover').and.callThrough();

            (tEditor as any).onEndTableMove(false);

            expect(disposeMoverSpy).not.toHaveBeenCalled();
        });

        it('onAfterInsert disposes the table resizer and finishes editing', () => {
            setup();
            const finishSpy = spyOn(tEditor as any, 'onFinishEditing').and.returnValue(false);

            (tEditor as any).onAfterInsert();

            expect(editor.getDocument().getElementById(TABLE_RESIZER_ID)).toBeNull();
            expect(finishSpy).toHaveBeenCalled();
        });

        it('onBeforeEditTable applies the logical root', () => {
            setup();
            const setLogicalRootSpy = spyOn(editor, 'setLogicalRoot');

            (tEditor as any).onBeforeEditTable();

            expect(setLogicalRootSpy).toHaveBeenCalledWith(null);
        });

        it('getOnMouseOut disposes the editor when the mouse leaves to an outside element', () => {
            setup();
            const feature = editor.getDocument().createElement('div');
            const disposeSpy = spyOn(tEditor, 'dispose');
            const handler = (tEditor as any).getOnMouseOut(feature);

            handler(<MouseEvent>(<any>{
                relatedTarget: editor.getDocument().createElement('span'),
            }));

            expect(disposeSpy).toHaveBeenCalled();
        });

        it('getOnMouseOut does not dispose while editing', () => {
            setup();
            const feature = editor.getDocument().createElement('div');
            const disposeSpy = spyOn(tEditor, 'dispose');
            (tEditor as any).isCurrentlyEditing = true;
            const handler = (tEditor as any).getOnMouseOut(feature);

            handler(<MouseEvent>(<any>{
                relatedTarget: editor.getDocument().createElement('span'),
            }));

            expect(disposeSpy).not.toHaveBeenCalled();
        });

        it('getOnMouseOut does not dispose when leaving to the feature itself', () => {
            setup();
            const feature = editor.getDocument().createElement('div');
            const disposeSpy = spyOn(tEditor, 'dispose');
            const handler = (tEditor as any).getOnMouseOut(feature);

            handler(<MouseEvent>(<any>{ relatedTarget: feature }));

            expect(disposeSpy).not.toHaveBeenCalled();
        });

        it('builds RTL editor features for a right-to-left table', () => {
            const tableRect = setup(getModelTable(), /* isRtl */ true);

            expect((tEditor as any).isRTL).toBe(true);

            // Exercise the RTL branches of onMouseMove (top and side hover areas)
            expect(() => tEditor.onMouseMove(tableRect.right, tableRect.top - 5)).not.toThrow();
            expect(() =>
                tEditor.onMouseMove(tableRect.right + 5, tableRect.top + tableRect.height / 2)
            ).not.toThrow();
        });
    });

    describe('anchorContainer', () => {
        let editor: IEditor;
        let tEditor: TableEditor;
        let table: any;
        const TEST_ID = 'cellResizerTest';
        const ANCHOR_CLASS = 'anchor_' + TEST_ID;

        afterEach(() => {
            afterTableTest(editor, tEditor, TEST_ID);
        });

        it('Table editor features, resizer and mover, inserted on anchor', () => {
            const setup = beforeTableTest(TEST_ID, ANCHOR_CLASS);
            editor = setup.editor;
            initialize(editor, getModelTable());
            table = editor.getDOMHelper().queryElements('table')[0];
            const contentDiv = editor.getDocument().getElementById(TEST_ID);
            const anchor = editor
                .getDocument()
                .getElementsByClassName(ANCHOR_CLASS)[0] as HTMLElement;
            tEditor = new TableEditor(editor, table, null, () => {}, anchor, contentDiv, undefined);

            // Move mouse to the first cell
            const cellRect = getCellRect(editor, 0, 0);
            tEditor.onMouseMove(cellRect.left, cellRect.bottom);

            // Look for table mover and resizer on the anchor
            const mover = anchor?.querySelector('#' + TABLE_MOVER_ID);
            const resizer = anchor?.querySelector('#' + TABLE_RESIZER_ID);
            expect(!!mover).toBe(true);
            expect(!!resizer).toBe(true);
        });

        it('Table editor features, resizer and mover, not inserted on anchor', () => {
            const setup = beforeTableTest(TEST_ID);
            editor = setup.editor;
            initialize(editor, getModelTable());
            table = editor.getDOMHelper().queryElements('table')[0];
            const contentDiv = editor.getDocument().getElementById(TEST_ID);
            const anchor = editor
                .getDocument()
                .getElementsByClassName(ANCHOR_CLASS)[0] as HTMLElement;
            tEditor = new TableEditor(editor, table, null, () => {}, anchor, contentDiv, undefined);

            // Move mouse to the first cell
            const cellRect = getCellRect(editor, 0, 0);
            tEditor.onMouseMove(cellRect.left, cellRect.bottom);

            // Look for table mover and resizer on the anchor
            const mover = anchor?.querySelector('#' + TABLE_MOVER_ID);
            const resizer = anchor?.querySelector('#' + TABLE_RESIZER_ID);
            expect(!!mover).toBe(false);
            expect(!!resizer).toBe(false);
        });
    });
});
