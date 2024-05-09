import { DOMEventHandlerFunction, IEditor } from 'roosterjs-content-model-types';
import { getModelTable } from './tableData';
import { TABLE_MOVER_ID } from '../../lib/tableEdit/editors/features/TableMover';
import { TABLE_RESIZER_ID } from '../../lib/tableEdit/editors/features/TableResizer';
import { TableEditFeatureName } from '../../lib/tableEdit/editors/features/TableEditFeatureName';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    HORIZONTAL_INSERTER_ID,
    VERTICAL_INSERTER_ID,
} from '../../lib/tableEdit/editors/features/TableInserter';
import {
    afterTableTest,
    beforeTableTest,
    getCellRect,
    initialize,
    mouseToPoint,
} from './TableEditTestHelper';
import {
    HORIZONTAL_RESIZER_ID,
    VERTICAL_RESIZER_ID,
} from '../../lib/tableEdit/editors/features/CellResizer';

describe('TableEdit', () => {
    describe('disableFeatures', () => {
        const insideTheOffset = 5;
        let editor: IEditor;
        let plugin: TableEditPlugin;
        let handler: Record<string, DOMEventHandlerFunction>;
        const TEST_ID = 'test';

        function runDisableFeatureSetup(featuresToDisable: TableEditFeatureName[]) {
            // Create editor, plugin, and table
            const setup = beforeTableTest(TEST_ID, undefined, featuresToDisable);
            editor = setup.editor;
            plugin = setup.plugin;
            handler = setup.handler;
            return initialize(editor, getModelTable());
        }

        it('Disable Horizontal Inserter', () => {
            const tableRect = runDisableFeatureSetup(['HorizontalTableInserter']);
            // Move mouse to bottom left of table
            mouseToPoint({ x: tableRect.left - insideTheOffset, y: tableRect.bottom }, handler);
            const feature = editor.getDocument().getElementById(HORIZONTAL_INSERTER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Vertical Inserter', () => {
            const tableRect = runDisableFeatureSetup(['VerticalTableInserter']);
            // Move mouse to top right of table
            mouseToPoint({ x: tableRect.right, y: tableRect.top - insideTheOffset }, handler);
            const feature = editor.getDocument().getElementById(VERTICAL_INSERTER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Horizontal Resizer', () => {
            const tableRect = runDisableFeatureSetup(['CellResizer']);
            // Move mouse to bottom right of table
            mouseToPoint({ x: tableRect.right - insideTheOffset, y: tableRect.bottom }, handler);
            const feature = editor.getDocument().getElementById(HORIZONTAL_RESIZER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Vertical Resizer', () => {
            const tableRect = runDisableFeatureSetup(['CellResizer']);
            // Move mouse to bottom right of table
            mouseToPoint({ x: tableRect.right, y: tableRect.bottom - insideTheOffset }, handler);
            const feature = editor.getDocument().getElementById(VERTICAL_RESIZER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Table Resizer', () => {
            const tableRect = runDisableFeatureSetup(['TableResizer']);
            // Move mouse to center of table
            mouseToPoint(
                {
                    x: tableRect.left + tableRect.width / 2,
                    y: tableRect.top + tableRect.height / 2,
                },
                handler
            );
            const feature = editor.getDocument().getElementById(TABLE_RESIZER_ID);
            expect(!!feature).toBe(false);
        });

        it('Disable Table Mover', () => {
            const tableRect = runDisableFeatureSetup(['TableMover', 'TableSelector']);
            // Move mouse to center of table
            mouseToPoint(
                {
                    x: tableRect.left + tableRect.width / 2,
                    y: tableRect.top + tableRect.height / 2,
                },
                handler
            );
            const feature = editor.getDocument().getElementById(TABLE_MOVER_ID);
            expect(!!feature).toBe(false);
        });

        afterEach(() => {
            afterTableTest(editor, plugin, TEST_ID);
        });
    });

    describe('anchorContainer', () => {
        let editor: IEditor;
        let plugin: TableEditPlugin;
        const TEST_ID = 'cellResizerTest';
        const ANCHOR_CLASS = 'anchor_' + TEST_ID;
        let handler: Record<string, DOMEventHandlerFunction>;

        afterEach(() => {
            afterTableTest(editor, plugin, TEST_ID);
        });

        it('Table editor features, resizer and mover, inserted on anchor', () => {
            // Create editor, plugin, and table
            const setup = beforeTableTest(TEST_ID, ANCHOR_CLASS);
            editor = setup.editor;
            plugin = setup.plugin;
            handler = setup.handler;
            initialize(editor, getModelTable());

            // Move mouse to the first cell
            const cellRect = getCellRect(editor, 0, 0);
            mouseToPoint({ x: cellRect.left, y: cellRect.bottom }, handler);

            // Look for table mover and resizer on the anchor
            const anchor = editor.getDocument().getElementsByClassName(ANCHOR_CLASS)[0];
            const mover = anchor?.querySelector('#' + TABLE_MOVER_ID);
            const resizer = anchor?.querySelector('#' + TABLE_RESIZER_ID);
            expect(!!mover).toBe(true);
            expect(!!resizer).toBe(true);
        });

        it('Table editor features, resizer and mover, not inserted on anchor', () => {
            // Create editor, plugin, and table
            const setup = beforeTableTest(TEST_ID);
            editor = setup.editor;
            plugin = setup.plugin;
            handler = setup.handler;
            initialize(editor, getModelTable());

            // Move mouse to the first cell
            const cellRect = getCellRect(editor, 0, 0);
            mouseToPoint({ x: cellRect.left, y: cellRect.bottom }, handler);

            // Look for table mover and resizer on the anchor
            const anchor = editor.getDocument().getElementsByClassName(ANCHOR_CLASS)[0];
            const mover = anchor?.querySelector('#' + TABLE_MOVER_ID);
            const resizer = anchor?.querySelector('#' + TABLE_RESIZER_ID);
            expect(!!mover).toBe(false);
            expect(!!resizer).toBe(false);
        });
    });
});
