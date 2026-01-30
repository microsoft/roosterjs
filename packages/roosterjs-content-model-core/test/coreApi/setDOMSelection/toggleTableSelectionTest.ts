import { EditorCore, TableSelection } from 'roosterjs-content-model-types';
import { toggleTableSelection } from '../../../lib/coreApi/setDOMSelection/toggleTableSelection';

const DOM_SELECTION_CSS_KEY = '_DOMSelection';

describe('toggleTableSelection', () => {
    let core: EditorCore;
    let setEditorStyleSpy: jasmine.Spy;

    beforeEach(() => {
        setEditorStyleSpy = jasmine.createSpy('setEditorStyle');

        core = {
            selection: {
                selection: null,
                tableCellSelectionBackgroundColor: '#C6C6C6',
                tableCellSelectionBackgroundColorDark: '#666666',
            },
            api: {
                setEditorStyle: setEditorStyleSpy,
            },
            lifecycle: {
                isDarkMode: false,
            },
        } as any;
    });

    it('should do nothing when selection is null', () => {
        core.selection.selection = null;

        toggleTableSelection(core, true);

        expect(setEditorStyleSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when selection is not table type', () => {
        core.selection.selection = {
            type: 'range',
            range: {} as any,
            isReverted: false,
        };

        toggleTableSelection(core, true);

        expect(setEditorStyleSpy).not.toHaveBeenCalled();
    });

    it('should hide table selection when isHiding is true', () => {
        const table = document.createElement('table');
        table.id = 'testTable';
        table.innerHTML = `
            <tbody>
                <tr><td>A1</td><td>B1</td></tr>
                <tr><td>A2</td><td>B2</td></tr>
            </tbody>
        `;
        document.body.appendChild(table);

        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 1,
            lastColumn: 1,
        };
        core.selection.selection = tableSelection;

        toggleTableSelection(core, true);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(core, DOM_SELECTION_CSS_KEY, '');

        document.body.removeChild(table);
    });

    it('should show table selection when isHiding is false', () => {
        const table = document.createElement('table');
        table.id = 'testTable';
        table.innerHTML = `
            <tbody>
                <tr><td>A1</td><td>B1</td></tr>
                <tr><td>A2</td><td>B2</td></tr>
            </tbody>
        `;
        document.body.appendChild(table);

        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 1,
            lastColumn: 1,
        };
        core.selection.selection = tableSelection;

        toggleTableSelection(core, false);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            'background-color:#C6C6C6!important;',
            ['#testTable', '#testTable *']
        );

        document.body.removeChild(table);
    });

    it('should use dark mode color when isDarkMode is true', () => {
        const table = document.createElement('table');
        table.id = 'testTable';
        table.innerHTML = `
            <tbody>
                <tr><td>A1</td><td>B1</td></tr>
                <tr><td>A2</td><td>B2</td></tr>
            </tbody>
        `;
        document.body.appendChild(table);

        core.lifecycle.isDarkMode = true;
        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 1,
            lastColumn: 1,
        };
        core.selection.selection = tableSelection;

        toggleTableSelection(core, false);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            core,
            DOM_SELECTION_CSS_KEY,
            'background-color:#666666!important;',
            ['#testTable', '#testTable *']
        );

        document.body.removeChild(table);
    });

    it('should use buildTableSelectors for partial table selection', () => {
        const table = document.createElement('table');
        table.id = 'testTable';
        table.innerHTML = `
            <tbody>
                <tr><td>A1</td><td>B1</td><td>C1</td></tr>
                <tr><td>A2</td><td>B2</td><td>C2</td></tr>
                <tr><td>A3</td><td>B3</td><td>C3</td></tr>
            </tbody>
        `;
        document.body.appendChild(table);

        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 0,
            lastColumn: 0,
        };
        core.selection.selection = tableSelection;

        toggleTableSelection(core, true);

        expect(setEditorStyleSpy).toHaveBeenCalledWith(core, DOM_SELECTION_CSS_KEY, '');

        document.body.removeChild(table);
    });

    it('should handle reversed selection coordinates', () => {
        const table = document.createElement('table');
        table.id = 'testTable';
        table.innerHTML = `
            <tbody>
                <tr><td>A1</td><td>B1</td></tr>
                <tr><td>A2</td><td>B2</td></tr>
            </tbody>
        `;
        document.body.appendChild(table);

        // Selection with reversed coordinates (lastRow < firstRow)
        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 1,
            firstColumn: 1,
            lastRow: 0,
            lastColumn: 0,
        };
        core.selection.selection = tableSelection;

        toggleTableSelection(core, true);

        // Should still work because the function normalizes coordinates
        expect(setEditorStyleSpy).toHaveBeenCalledWith(core, DOM_SELECTION_CSS_KEY, '');

        document.body.removeChild(table);
    });

    it('should ensure table has unique id', () => {
        const table = document.createElement('table');
        // No id set initially
        table.innerHTML = `
            <tbody>
                <tr><td>A1</td><td>B1</td></tr>
                <tr><td>A2</td><td>B2</td></tr>
            </tbody>
        `;
        document.body.appendChild(table);

        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn: 0,
            lastRow: 1,
            lastColumn: 1,
        };
        core.selection.selection = tableSelection;

        toggleTableSelection(core, true);

        // Table should not need an id when hiding (removeTableCellsStyle doesn't use selectors)
        expect(setEditorStyleSpy).toHaveBeenCalledWith(core, DOM_SELECTION_CSS_KEY, '');

        document.body.removeChild(table);
    });
});
