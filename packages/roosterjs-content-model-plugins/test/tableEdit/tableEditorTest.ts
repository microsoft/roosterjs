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
import {
    ROW_SELECTOR_ID,
    COLUMN_SELECTOR_ID,
} from '../../lib/tableEdit/editors/features/TableRowColumnSelector';

describe('TableEditor', () => {
    xdescribe('disableFeatures', () => {
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

        /************************ Table Row Column Selector tests ************************/

        it('Disable Table Row Selector', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), ['TableRowSelector']);
            // Move mouse to left side of table (row selector area)
            tEditor.onMouseMove(
                tableRect.left - insideTheOffset,
                tableRect.top + tableRect.height / 2
            );
            const feature = editor.getDocument().getElementById(ROW_SELECTOR_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Table Column Selector', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), ['TableColumnSelector']);
            // Move mouse to top side of table (column selector area)
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top - insideTheOffset
            );
            const feature = editor.getDocument().getElementById(COLUMN_SELECTOR_ID);
            expect(!!feature).toBe(false);
        });

        it('Add table row selector if cursor on left side', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), []);
            // Move mouse to left side of table
            tEditor.onMouseMove(
                tableRect.left - insideTheOffset,
                tableRect.top + tableRect.height / 2
            );
            const rowFeature = editor.getDocument().getElementById(ROW_SELECTOR_ID);
            const columnFeature = editor.getDocument().getElementById(COLUMN_SELECTOR_ID);
            expect(!!rowFeature).toBe(true);
            expect(!!columnFeature).toBe(false);
        });

        it('Add table column selector if cursor on top side', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), []);
            // Move mouse to top side of table
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top - insideTheOffset
            );
            const rowFeature = editor.getDocument().getElementById(ROW_SELECTOR_ID);
            const columnFeature = editor.getDocument().getElementById(COLUMN_SELECTOR_ID);
            expect(!!rowFeature).toBe(false);
            expect(!!columnFeature).toBe(true);
        });

        it('Not add table row/column selector if cursor in middle of table', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), []);
            // Move mouse to center of table
            tEditor.onMouseMove(
                tableRect.left + tableRect.width / 2,
                tableRect.top + tableRect.height / 2
            );
            const rowFeature = editor.getDocument().getElementById(ROW_SELECTOR_ID);
            const columnFeature = editor.getDocument().getElementById(COLUMN_SELECTOR_ID);
            expect(!!rowFeature).toBe(false);
            expect(!!columnFeature).toBe(false);
        });

        it('Not add table row/column selector if cursor on top left corner', () => {
            const tableRect = runDisableFeatureSetup(getModelTable(), []);
            // Move mouse to top left corner of table
            tEditor.onMouseMove(tableRect.left - insideTheOffset, tableRect.top - insideTheOffset);
            const rowFeature = editor.getDocument().getElementById(ROW_SELECTOR_ID);
            const columnFeature = editor.getDocument().getElementById(COLUMN_SELECTOR_ID);
            expect(!!rowFeature).toBe(false);
            expect(!!columnFeature).toBe(false);
        });

        afterEach(() => {
            afterTableTest(editor, tEditor, TEST_ID);
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
