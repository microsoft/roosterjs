import { AnnouncePlugin } from '../../lib/announce/AnnouncePlugin';
import type {
    IEditor,
    PluginEvent,
    SelectionChangedEvent,
    TableSelection,
    TableSelectionInfo,
} from 'roosterjs-content-model-types';

describe('AnnouncePlugin', () => {
    let plugin: AnnouncePlugin;
    let editor: IEditor;
    let announceSpy: jasmine.Spy;

    beforeEach(() => {
        announceSpy = jasmine.createSpy('announce');
        editor = {
            announce: announceSpy,
        } as any;

        plugin = new AnnouncePlugin();
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
    });

    it('should get plugin name', () => {
        expect(plugin.getName()).toBe('Announce');
    });

    it('should initialize and dispose correctly', () => {
        const newPlugin = new AnnouncePlugin();
        const mockEditor = {} as IEditor;

        newPlugin.initialize(mockEditor);
        expect(newPlugin['editor']).toBe(mockEditor);

        newPlugin.dispose();
        expect(newPlugin['editor']).toBeNull();
    });

    describe('onPluginEvent', () => {
        it('should ignore non-selectionChanged events', () => {
            const event: PluginEvent = {
                eventType: 'contentChanged',
                source: 'Test',
            };

            plugin.onPluginEvent(event);

            expect(announceSpy).not.toHaveBeenCalled();
        });

        it('should ignore selectionChanged events with non-table selections', () => {
            const event: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: {
                    type: 'range',
                    range: document.createRange(),
                    isReverted: false,
                },
            };

            plugin.onPluginEvent(event);

            expect(announceSpy).not.toHaveBeenCalled();
        });

        it('should announce when table selection changes from no selection', () => {
            const table = document.createElement('table');
            const td1 = document.createElement('td');
            td1.innerText = 'Cell 1';

            const tableSelectionInfo: TableSelectionInfo = {
                table,
                parsedTable: [[td1]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 0 },
                startNode: td1,
            };

            const newTableSelection: TableSelection = {
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 0,
                tableSelectionInfo,
            };

            const event: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: newTableSelection,
            };

            plugin.onPluginEvent(event);

            expect(announceSpy).toHaveBeenCalledWith({
                defaultStrings: 'selected',
                formatStrings: [' Cell 1,'],
            });
        });

        it('should announce when expanding table selection', () => {
            const table = document.createElement('table');
            const td1 = document.createElement('td');
            td1.innerText = 'Cell 1';
            const td2 = document.createElement('td');
            td2.innerText = 'Cell 2';

            // First, set up a previous selection (1x1)
            const initialTableSelectionInfo: TableSelectionInfo = {
                table,
                parsedTable: [[td1, td2]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 0 },
                startNode: td1,
            };

            const initialTableSelection: TableSelection = {
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 0,
                tableSelectionInfo: initialTableSelectionInfo,
            };

            const initialEvent: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: initialTableSelection,
            };

            plugin.onPluginEvent(initialEvent);

            // Clear the spy to test the next call
            announceSpy.calls.reset();

            // Now expand to 1x2 selection
            const expandedTableSelectionInfo: TableSelectionInfo = {
                table,
                parsedTable: [[td1, td2]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 1 },
                startNode: td1,
            };

            const expandedTableSelection: TableSelection = {
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 1,
                tableSelectionInfo: expandedTableSelectionInfo,
            };

            const expandEvent: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: expandedTableSelection,
            };

            plugin.onPluginEvent(expandEvent);

            expect(announceSpy).toHaveBeenCalledWith({
                defaultStrings: 'selected',
                formatStrings: [' Cell 1, Cell 2,'],
            });
        });

        it('should announce when contracting table selection', () => {
            const table = document.createElement('table');
            const td1 = document.createElement('td');
            td1.innerText = 'Cell 1';
            const td2 = document.createElement('td');
            td2.innerText = 'Cell 2';

            // First, set up a previous selection (1x2)
            const initialTableSelectionInfo: TableSelectionInfo = {
                table,
                parsedTable: [[td1, td2]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 1 },
                startNode: td1,
            };

            const initialTableSelection: TableSelection = {
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 1,
                tableSelectionInfo: initialTableSelectionInfo,
            };

            const initialEvent: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: initialTableSelection,
            };

            plugin.onPluginEvent(initialEvent);

            // Clear the spy to test the next call
            announceSpy.calls.reset();

            // Now contract to 1x1 selection
            const contractedTableSelectionInfo: TableSelectionInfo = {
                table,
                parsedTable: [[td1, td2]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 0 },
                startNode: td1,
            };

            const contractedTableSelection: TableSelection = {
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 0,
                tableSelectionInfo: contractedTableSelectionInfo,
            };

            const contractEvent: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: contractedTableSelection,
            };

            plugin.onPluginEvent(contractEvent);

            expect(announceSpy).toHaveBeenCalledWith({
                defaultStrings: 'unselected',
                formatStrings: [' Cell 1,'],
            });
        });

        it('should not announce when table selection is identical', () => {
            const table = document.createElement('table');
            const td1 = document.createElement('td');
            td1.innerText = 'Cell 1';

            const tableSelectionInfo: TableSelectionInfo = {
                table,
                parsedTable: [[td1]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 0 },
                startNode: td1,
            };

            const tableSelection: TableSelection = {
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 0,
                tableSelectionInfo,
            };

            // First selection
            const event1: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: tableSelection,
            };

            plugin.onPluginEvent(event1);
            expect(announceSpy).toHaveBeenCalledTimes(1);

            // Reset spy
            announceSpy.calls.reset();

            // Identical selection - should not announce
            const event2: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: { ...tableSelection }, // Same coordinates
            };

            plugin.onPluginEvent(event2);
            expect(announceSpy).not.toHaveBeenCalled();
        });

        it('should handle transition from table to non-table selection', () => {
            const table = document.createElement('table');
            const td1 = document.createElement('td');
            td1.innerText = 'Cell 1';

            const tableSelectionInfo: TableSelectionInfo = {
                table,
                parsedTable: [[td1]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 0 },
                startNode: td1,
            };

            const tableSelection: TableSelection = {
                type: 'table',
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 0,
                lastColumn: 0,
                tableSelectionInfo,
            };

            // First, have a table selection
            const tableEvent: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: tableSelection,
            };

            plugin.onPluginEvent(tableEvent);
            expect(announceSpy).toHaveBeenCalledTimes(1);

            // Reset spy
            announceSpy.calls.reset();

            // Now transition to range selection - should not announce
            const rangeEvent: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: {
                    type: 'range',
                    range: document.createRange(),
                    isReverted: false,
                },
            };

            plugin.onPluginEvent(rangeEvent);
            expect(announceSpy).not.toHaveBeenCalled();
        });

        it('should handle editor being null', () => {
            plugin.dispose(); // This sets editor to null

            const event: SelectionChangedEvent = {
                eventType: 'selectionChanged',
                newSelection: {
                    type: 'table',
                    table: document.createElement('table'),
                    firstRow: 0,
                    firstColumn: 0,
                    lastRow: 0,
                    lastColumn: 0,
                    tableSelectionInfo: {
                        table: document.createElement('table'),
                        parsedTable: [[]],
                        firstCo: { row: 0, col: 0 },
                        lastCo: { row: 0, col: 0 },
                        startNode: document.createElement('td'),
                    },
                },
            };

            // Should not throw an error
            expect(() => plugin.onPluginEvent(event)).not.toThrow();
            expect(announceSpy).not.toHaveBeenCalled();
        });
    });
});
