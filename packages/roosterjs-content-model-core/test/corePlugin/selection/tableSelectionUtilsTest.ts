import {
    retrieveStringFromParsedTable,
    getIsSelectingOrUnselecting,
} from '../../../lib/corePlugin/selection/tableSelectionUtils';
import type { TableSelectionInfo, TableCellCoordinate } from 'roosterjs-content-model-types';
import type { Coordinates } from 'roosterjs-editor-types';

describe('tableSelectionUtils', () => {
    describe('retrieveStringFromParsedTable', () => {
        it('should extract text from single cell', () => {
            const td1 = document.createElement('td');
            td1.innerText = 'Hello World';

            const tableSelectionInfo: TableSelectionInfo = {
                parsedTable: [[td1]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 0 },
                table: document.createElement('table'),
                startNode: td1,
            };

            const result = retrieveStringFromParsedTable(tableSelectionInfo);
            expect(result).toBe(' Hello World,');
        });

        it('should extract text from multiple cells', () => {
            const td1 = document.createElement('td');
            td1.innerText = 'Cell 1';
            const td2 = document.createElement('td');
            td2.innerText = 'Cell 2';
            const td3 = document.createElement('td');
            td3.innerText = 'Cell 3';
            const td4 = document.createElement('td');
            td4.innerText = 'Cell 4';

            const tableSelectionInfo: TableSelectionInfo = {
                parsedTable: [
                    [td1, td2],
                    [td3, td4],
                ],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 1, col: 1 },
                table: document.createElement('table'),
                startNode: td1,
            };

            const result = retrieveStringFromParsedTable(tableSelectionInfo);
            expect(result).toBe(' Cell 1, Cell 2, Cell 3, Cell 4,');
        });

        it('should handle string placeholders in parsed table', () => {
            const td1 = document.createElement('td');
            td1.innerText = 'Real Cell';

            const tableSelectionInfo: TableSelectionInfo = {
                parsedTable: [
                    [td1, 'spanLeft' as const],
                    ['spanTop' as const, td1],
                ],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 1, col: 1 },
                table: document.createElement('table'),
                startNode: td1,
            };

            const result = retrieveStringFromParsedTable(tableSelectionInfo);
            // Should only include text from real cells, not string placeholders
            expect(result).toBe(' Real Cell, Real Cell,');
        });

        it('should return empty string when no lastCo is provided', () => {
            const td1 = document.createElement('td');
            td1.innerText = 'Cell 1';

            const tableSelectionInfo: TableSelectionInfo = {
                parsedTable: [[td1]],
                firstCo: { row: 0, col: 0 },
                lastCo: undefined,
                table: document.createElement('table'),
                startNode: td1,
            };

            const result = retrieveStringFromParsedTable(tableSelectionInfo);
            expect(result).toBe('');
        });

        it('should handle partial table selection', () => {
            const td1 = document.createElement('td');
            td1.innerText = 'A1';
            const td2 = document.createElement('td');
            td2.innerText = 'B1';
            const td3 = document.createElement('td');
            td3.innerText = 'C1';
            const td4 = document.createElement('td');
            td4.innerText = 'A2';
            const td5 = document.createElement('td');
            td5.innerText = 'B2';
            const td6 = document.createElement('td');
            td6.innerText = 'C2';

            const tableSelectionInfo: TableSelectionInfo = {
                parsedTable: [
                    [td1, td2, td3],
                    [td4, td5, td6],
                ],
                firstCo: { row: 0, col: 1 }, // Start from B1
                lastCo: { row: 1, col: 2 }, // End at C2
                table: document.createElement('table'),
                startNode: td2,
            };

            const result = retrieveStringFromParsedTable(tableSelectionInfo);
            expect(result).toBe(' B1, C1, B2, C2,');
        });

        it('should handle empty cells', () => {
            const td1 = document.createElement('td');
            td1.innerText = '';
            const td2 = document.createElement('td');
            td2.innerText = 'Not Empty';

            const tableSelectionInfo: TableSelectionInfo = {
                parsedTable: [[td1, td2]],
                firstCo: { row: 0, col: 0 },
                lastCo: { row: 0, col: 1 },
                table: document.createElement('table'),
                startNode: td1,
            };

            const result = retrieveStringFromParsedTable(tableSelectionInfo);
            expect(result).toBe(' , Not Empty,');
        });
    });

    describe('getIsSelectingOrUnselecting', () => {
        it('should return "selecting" when selection area increases', () => {
            const prevFirstCo: Coordinates = { x: 0, y: 0 };
            const prevLastCo: Coordinates = { x: 0, y: 0 }; // 1x1 selection (area = 1)
            const firstCo: TableCellCoordinate = { row: 0, col: 0 };
            const lastCo: TableCellCoordinate = { row: 1, col: 1 }; // 2x2 selection (area = 4)

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('selecting');
        });

        it('should return "unselecting" when selection area decreases', () => {
            const prevFirstCo: Coordinates = { x: 0, y: 0 };
            const prevLastCo: Coordinates = { x: 1, y: 1 }; // 2x2 selection (area = 4)
            const firstCo: TableCellCoordinate = { row: 0, col: 0 };
            const lastCo: TableCellCoordinate = { row: 0, col: 0 }; // 1x1 selection (area = 1)

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('unselecting');
        });

        it('should return "selecting" when selection moves with same area', () => {
            const prevFirstCo: Coordinates = { x: 0, y: 0 };
            const prevLastCo: Coordinates = { x: 1, y: 0 }; // 2x1 selection at (0,0)-(1,0)
            const firstCo: TableCellCoordinate = { row: 0, col: 1 };
            const lastCo: TableCellCoordinate = { row: 0, col: 2 }; // 2x1 selection at (0,1)-(0,2)

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('selecting');
        });

        it('should return selecting when selection is identical', () => {
            const prevFirstCo: Coordinates = { x: 0, y: 0 };
            const prevLastCo: Coordinates = { x: 1, y: 1 };
            const firstCo: TableCellCoordinate = { row: 0, col: 0 };
            const lastCo: TableCellCoordinate = { row: 1, col: 1 };

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('selecting');
        });

        it('should handle single cell selections correctly', () => {
            const prevFirstCo: Coordinates = { x: 1, y: 1 };
            const prevLastCo: Coordinates = { x: 1, y: 1 }; // Single cell at (1,1)
            const firstCo: TableCellCoordinate = { row: 2, col: 2 };
            const lastCo: TableCellCoordinate = { row: 2, col: 2 }; // Single cell at (2,2)

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('selecting'); // Position changed with same area
        });

        it('should handle rectangular selections', () => {
            const prevFirstCo: Coordinates = { x: 0, y: 0 };
            const prevLastCo: Coordinates = { x: 2, y: 1 }; // 3x2 selection (area = 6)
            const firstCo: TableCellCoordinate = { row: 0, col: 0 };
            const lastCo: TableCellCoordinate = { row: 2, col: 1 }; // 2x3 selection (area = 6)

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('selecting'); // Same area but different shape/position
        });

        it('should handle negative coordinates correctly', () => {
            // This tests the Math.abs usage in area calculation
            const prevFirstCo: Coordinates = { x: 2, y: 2 };
            const prevLastCo: Coordinates = { x: 0, y: 0 }; // Selection from (2,2) to (0,0)
            const firstCo: TableCellCoordinate = { row: 2, col: 2 };
            const lastCo: TableCellCoordinate = { row: 1, col: 1 }; // Smaller selection

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('unselecting');
        });

        it('should handle edge case with zero area (should not happen in practice)', () => {
            const prevFirstCo: Coordinates = { x: 0, y: 0 };
            const prevLastCo: Coordinates = { x: 0, y: 0 };
            const firstCo: TableCellCoordinate = { row: 1, col: 1 };
            const lastCo: TableCellCoordinate = { row: 1, col: 1 };

            const result = getIsSelectingOrUnselecting(prevFirstCo, prevLastCo, firstCo, lastCo);
            expect(result).toBe('selecting'); // Position changed
        });
    });
});
