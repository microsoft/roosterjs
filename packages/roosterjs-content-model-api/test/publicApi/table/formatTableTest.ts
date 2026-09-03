import { TableBorderFormat } from 'roosterjs-content-model-dom';
import {
    createContentModelDocument,
    createTable,
    createTableCell,
} from 'roosterjs-content-model-dom';
import { formatTable } from '../../../lib/publicApi/table/formatTable';
import type {
    ContentModelDocument,
    ContentModelFormatter,
    ContentModelTable,
    FormatContentModelOptions,
    IEditor,
    TableMetadataFormat,
} from 'roosterjs-content-model-types';

describe('formatTable', () => {
    const colors = {
        transparent: 'transparent',
        black: '#000000',
        gray: '#CCCCCC',
        blue: '#0C64C0',
        orange: '#DE6A19',
        yellow: '#DCBE22',
        red: '#ED5C57',
        purple: '#B36AE2',
        green: '#0C882A',
    };
    const lightColors: Record<string, string> = {
        [colors.black]: '#CCCCCC',
        [colors.gray]: '#F4F4F4',
        [colors.blue]: '#CEE0F2',
        [colors.orange]: '#F8E1D1',
        [colors.yellow]: '#F8F2D2',
        [colors.red]: '#FBDEDD',
        [colors.purple]: '#EFE1F9',
        [colors.green]: '#CEE7D4',
    };
    const defaults: TableMetadataFormat = {
        hasHeaderRow: true,
        hasFirstColumn: true,
        hasBandedRows: true,
        hasBandedColumns: false,
        bgColorEven: null,
        bgColorOdd: null,
        headerRowCustomStyles: null,
        firstColumnCustomStyles: null,
    };
    const bold = { fontWeight: 'bold' };
    const boldHeader = { fontWeight: 'bold', italic: false };

    type FormatFactory = (color: string) => TableMetadataFormat;
    type FormatCase = {
        name: string;
        format: TableMetadataFormat;
    };

    function allBorders(color: string) {
        return {
            topBorderColor: color,
            bottomBorderColor: color,
            verticalBorderColor: color,
            tableBorderFormat: TableBorderFormat.Default,
        };
    }

    function noBorders() {
        return {
            topBorderColor: colors.transparent,
            bottomBorderColor: colors.transparent,
            verticalBorderColor: colors.transparent,
            tableBorderFormat: TableBorderFormat.Clear,
        };
    }

    const tableGrid: FormatFactory = color => ({
        ...defaults,
        ...allBorders(color),
        headerRowColor: null,
        headerRowCustomStyles: { fontWeight: 'normal', italic: false },
        firstColumnCustomStyles: { fontWeight: 'normal', italic: false },
    });
    const gridTable1: FormatFactory = color => ({
        ...defaults,
        ...allBorders(color),
        headerRowColor: null,
        headerRowCustomStyles: { ...boldHeader, borderBottomColor: color },
        firstColumnCustomStyles: bold,
    });
    const gridTable2: FormatFactory = color => ({
        ...defaults,
        ...allBorders(color),
        tableBorderFormat: TableBorderFormat.NoSideBorders,
        headerRowColor: colors.transparent,
        bgColorOdd: lightColors[color],
        headerRowCustomStyles: { ...boldHeader, borderBottomColor: color },
        firstColumnCustomStyles: bold,
    });
    const gridTable3: FormatFactory = color => ({
        ...defaults,
        ...allBorders(color),
        headerRowColor: colors.transparent,
        bgColorOdd: lightColors[color],
        headerRowCustomStyles: { ...boldHeader, borderBottomColor: color },
        firstColumnCustomStyles: {
            fontWeight: 'normal',
            italic: true,
            textAlign: 'end',
            borderRightColor: color,
            backgroundColor: colors.transparent,
        },
    });
    const listTable1: FormatFactory = color => ({
        ...defaults,
        ...noBorders(),
        headerRowColor: null,
        bgColorOdd: lightColors[color],
        headerRowCustomStyles: { ...boldHeader, borderBottomColor: color },
        firstColumnCustomStyles: bold,
    });
    const listTable2: FormatFactory = color => ({
        ...defaults,
        topBorderColor: color,
        bottomBorderColor: color,
        verticalBorderColor: colors.transparent,
        tableBorderFormat: TableBorderFormat.ListWithSideBorders,
        headerRowColor: null,
        bgColorOdd: lightColors[color],
        headerRowCustomStyles: boldHeader,
        firstColumnCustomStyles: bold,
    });
    const listTable3: FormatFactory = color => ({
        ...defaults,
        topBorderColor: color,
        bottomBorderColor: color,
        verticalBorderColor: color,
        tableBorderFormat: TableBorderFormat.FirstColumnHeaderExternal,
        headerRowColor: color,
        headerRowCustomStyles: boldHeader,
        firstColumnCustomStyles: bold,
    });

    function createAccentCases(name: string, factory: FormatFactory): FormatCase[] {
        return [
            { name, format: factory(colors.black) },
            { name: `${name} - Accent 1`, format: factory(colors.blue) },
            { name: `${name} - Accent 2`, format: factory(colors.orange) },
            { name: `${name} - Accent 3`, format: factory(colors.yellow) },
            { name: `${name} - Accent 4`, format: factory(colors.red) },
            { name: `${name} - Accent 5`, format: factory(colors.purple) },
            { name: `${name} - Accent 6`, format: factory(colors.green) },
        ];
    }

    const formatCases: FormatCase[] = [
        { name: 'Table Grid', format: tableGrid(colors.black) },
        { name: 'Table Grid Light', format: tableGrid(colors.gray) },
        {
            name: 'Plain Table 1',
            format: {
                ...defaults,
                ...allBorders(colors.gray),
                headerRowColor: null,
                bgColorOdd: lightColors[colors.gray],
                headerRowCustomStyles: boldHeader,
                firstColumnCustomStyles: bold,
            },
        },
        {
            name: 'Plain Table 2',
            format: {
                ...defaults,
                topBorderColor: colors.black,
                bottomBorderColor: colors.black,
                verticalBorderColor: colors.transparent,
                tableBorderFormat: TableBorderFormat.ListWithSideBorders,
                headerRowColor: null,
                headerRowCustomStyles: {
                    ...boldHeader,
                    borderBottomColor: colors.black,
                },
                firstColumnCustomStyles: bold,
            },
        },
        {
            name: 'Plain Table 3',
            format: {
                ...defaults,
                ...noBorders(),
                headerRowColor: colors.transparent,
                bgColorOdd: lightColors[colors.black],
                headerRowCustomStyles: {
                    ...boldHeader,
                    borderBottomColor: colors.black,
                },
                firstColumnCustomStyles: {
                    ...bold,
                    borderRightColor: colors.black,
                },
            },
        },
        {
            name: 'Plain Table 4',
            format: {
                ...defaults,
                ...noBorders(),
                headerRowColor: null,
                bgColorOdd: lightColors[colors.black],
                headerRowCustomStyles: boldHeader,
                firstColumnCustomStyles: bold,
            },
        },
        {
            name: 'Plain Table 5',
            format: {
                ...defaults,
                ...noBorders(),
                headerRowColor: colors.transparent,
                bgColorOdd: lightColors[colors.black],
                headerRowCustomStyles: {
                    fontWeight: 'normal',
                    italic: true,
                    borderBottomColor: colors.black,
                },
                firstColumnCustomStyles: {
                    fontWeight: 'normal',
                    italic: true,
                    textAlign: 'end',
                    borderRightColor: colors.black,
                    backgroundColor: colors.transparent,
                },
            },
        },
        {
            name: 'Grid Table 1 Light',
            format: gridTable1(colors.gray),
        },
        ...createAccentCases('Grid Table 1 Light', gridTable1).slice(1),
        {
            name: 'Grid Table 2',
            format: gridTable2(colors.gray),
        },
        ...createAccentCases('Grid Table 2', gridTable2).slice(1),
        ...createAccentCases('Grid Table 3', gridTable3),
        ...createAccentCases('List Table 1 Light', listTable1),
        ...createAccentCases('List Table 2', listTable2),
        ...createAccentCases('List Table 3', listTable3),
    ];

    let editor: IEditor;
    let focusSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let formatResult: boolean | undefined;
    let model: ContentModelDocument;

    function createSelectedTable(): ContentModelTable {
        const table = createTable(4);

        table.rows.forEach((row, rowIndex) => {
            for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
                const cell = createTableCell();

                cell.blocks.push({
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: `Cell ${rowIndex},${columnIndex}`,
                            format: {},
                        },
                    ],
                    format: {},
                });
                cell.isSelected = rowIndex == 1 && columnIndex == 1;
                row.cells.push(cell);
            }
        });
        model.blocks.push(table);

        return table;
    }

    function getTransparentBorders(
        tableBorderFormat: number | undefined,
        rowIndex: number,
        columnIndex: number
    ): [boolean, boolean, boolean, boolean] {
        const firstRow = rowIndex == 0;
        const lastRow = rowIndex == 3;
        const firstColumn = columnIndex == 0;
        const lastColumn = columnIndex == 3;

        switch (tableBorderFormat) {
            case TableBorderFormat.ListWithSideBorders:
                return [false, !lastColumn, false, !firstColumn];
            case TableBorderFormat.FirstColumnHeaderExternal:
                return [
                    !firstRow,
                    (!lastColumn && !firstColumn) || (firstColumn && firstRow),
                    !lastRow && !firstRow,
                    !firstColumn,
                ];
            case TableBorderFormat.NoSideBorders:
                return [false, lastColumn, false, firstColumn];
            case TableBorderFormat.Clear:
                return [true, true, true, true];
            default:
                return [false, false, false, false];
        }
    }

    function getBorder(color: string | null | undefined): string {
        return color
            ? color == colors.transparent
                ? `1px none ${colors.transparent}`
                : `1px solid ${color}`
            : '1px none';
    }

    function verifyFormattedTable(table: ContentModelTable, format: TableMetadataFormat) {
        table.rows.forEach((row, rowIndex) =>
            row.cells.forEach((cell, columnIndex) => {
                const context = `Row ${rowIndex}, column ${columnIndex}`;
                const transparentBorders = getTransparentBorders(
                    format.tableBorderFormat,
                    rowIndex,
                    columnIndex
                );
                const borderColors = [
                    format.topBorderColor,
                    format.verticalBorderColor,
                    format.bottomBorderColor,
                    format.verticalBorderColor,
                ];
                const expectedBorders = borderColors.map((color, index) =>
                    getBorder(transparentBorders[index] ? null : color)
                );
                let expectedBackgroundColor =
                    format.hasBandedRows || format.hasBandedColumns
                        ? (format.hasBandedColumns &&
                              columnIndex % 2 != (format.hasFirstColumn ? 0 : 1)) ||
                          (format.hasBandedRows && rowIndex % 2 != (format.hasHeaderRow ? 0 : 1))
                            ? format.bgColorOdd
                            : format.bgColorEven
                        : format.bgColorEven;
                let expectedFontWeight: string | undefined;
                let expectedItalic: boolean | undefined;
                let expectedTextAlign: string | undefined;

                if (format.hasFirstColumn && columnIndex == 0) {
                    const firstColumnStyles = format.firstColumnCustomStyles;

                    expectedFontWeight = firstColumnStyles?.fontWeight ?? 'bold';
                    expectedItalic = firstColumnStyles?.italic || undefined;
                    expectedTextAlign = firstColumnStyles?.textAlign;

                    if (firstColumnStyles?.backgroundColor) {
                        expectedBackgroundColor = firstColumnStyles.backgroundColor;
                    }

                    if (firstColumnStyles?.borderTopColor !== undefined) {
                        expectedBorders[0] = getBorder(firstColumnStyles.borderTopColor);
                    }
                    if (firstColumnStyles?.borderRightColor !== undefined) {
                        expectedBorders[1] = getBorder(firstColumnStyles.borderRightColor);
                    }
                    if (firstColumnStyles?.borderBottomColor !== undefined) {
                        expectedBorders[2] = getBorder(firstColumnStyles.borderBottomColor);
                    }
                    if (firstColumnStyles?.borderLeftColor !== undefined) {
                        expectedBorders[3] = getBorder(firstColumnStyles.borderLeftColor);
                    }
                }

                if (format.hasHeaderRow && rowIndex == 0) {
                    const headerStyles = format.headerRowCustomStyles;

                    expectedFontWeight = headerStyles?.fontWeight ?? 'bold';
                    expectedItalic = headerStyles?.italic || undefined;
                    expectedTextAlign = headerStyles?.textAlign ?? expectedTextAlign;

                    if (format.headerRowColor) {
                        expectedBackgroundColor = format.headerRowColor;
                        expectedBorders[0] = getBorder(format.headerRowColor);
                        expectedBorders[1] = getBorder(format.headerRowColor);
                        expectedBorders[3] = getBorder(format.headerRowColor);
                    }
                    if (headerStyles?.borderBottomColor !== undefined) {
                        expectedBorders[2] = getBorder(headerStyles.borderBottomColor);
                    }
                }

                expect(cell.isHeader)
                    .withContext(context)
                    .toBe(format.hasHeaderRow && rowIndex == 0);
                expect(cell.format.backgroundColor)
                    .withContext(`${context} background`)
                    .toBe(expectedBackgroundColor || undefined);
                expect(cell.format.borderTop)
                    .withContext(`${context} top border`)
                    .toBe(expectedBorders[0]);
                expect(cell.format.borderRight)
                    .withContext(`${context} right border`)
                    .toBe(expectedBorders[1]);
                expect(cell.format.borderBottom)
                    .withContext(`${context} bottom border`)
                    .toBe(expectedBorders[2]);
                expect(cell.format.borderLeft)
                    .withContext(`${context} left border`)
                    .toBe(expectedBorders[3]);
                expect(cell.format.fontWeight)
                    .withContext(`${context} cell font weight`)
                    .toBe(expectedFontWeight);
                expect(cell.format.textAlign)
                    .withContext(`${context} alignment`)
                    .toBe(expectedTextAlign);
                expect(cell.blocks[0].segments[0].format.fontWeight)
                    .withContext(`${context} text font weight`)
                    .toBe(expectedFontWeight);
                expect(cell.blocks[0].segments[0].format.italic)
                    .withContext(`${context} italic`)
                    .toBe(expectedItalic);
            })
        );
    }

    function applyAndVerify(format: TableMetadataFormat) {
        const table = createSelectedTable();

        formatTable(editor, format);

        expect(focusSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'formatTable',
        });
        expect(formatResult).toBeTrue();
        verifyFormattedTable(table, format);
    }

    beforeEach(() => {
        model = createContentModelDocument();
        focusSpy = jasmine.createSpy('focus');
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, _options: FormatContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );
        editor = {
            focus: focusSpy,
            formatContentModel: formatContentModelSpy,
        } as IEditor;
    });

    it('does not format when there is no selected table', () => {
        formatTable(editor, formatCases[0].format);

        expect(focusSpy).toHaveBeenCalled();
        expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.anything(), {
            apiName: 'formatTable',
        });
        expect(formatResult).toBeFalse();
    });

    formatCases.forEach(testCase => {
        it(`applies ${testCase.name}`, () => {
            applyAndVerify(testCase.format);

            model = createContentModelDocument();
            focusSpy.calls.reset();
            formatContentModelSpy.calls.reset();
            applyAndVerify({
                ...testCase.format,
                hasBandedRows: false,
                hasBandedColumns: true,
            });
        });
    });
});
