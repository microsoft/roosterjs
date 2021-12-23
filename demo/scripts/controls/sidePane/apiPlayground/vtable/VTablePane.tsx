import * as Color from 'color';
import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import ColorPicker from '../../../colorPicker/ColorPicker';
import { formatTable } from 'roosterjs-editor-api';
import { getTableFormatInfo, getTagOfNode, saveTableInfo, VTable } from 'roosterjs-editor-dom';
import {
    IEditor,
    PositionType,
    TableBorderFormat,
    TableFormat,
    TableOperation,
    VCell,
} from 'roosterjs-editor-types';

const PREDEFINED_STYLES: Record<string, (color?: string, lightColor?: string) => TableFormat> = {
    GRID_WITHOUT_BORDER: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            false /** firstColumn */,
            TableBorderFormat.onlyMiddleBorders /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            null /** headerRowColor */
        ),
    GRID_WITH_BORDER: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            null /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            null /** headerRowColor */
        ),
    HEADER_ROW_WITH_BANDED_ROWS: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            false /** firstColumn */,
            null /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            color /** headerRowColor */
        ),
    LIST: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            null /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            null /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            null /** headerRowColor */
        ),
    HEADER_ROW: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            false /** firstColumn */,
            null /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            color /** headerRowColor */
        ),
    HEADER_ROW_AND_BANDED_ROWS_FIRST_COLUMN: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            true /** firstColumn */,
            null /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            color /** headerRowColor */
        ),
    BANDED_ROWS_FIRST_COLUMN: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.removeHeaderRowMiddleBorder /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            null /** headerRowColor */
        ),
    BANDED_ROWS_FIRST_COLUMN_NO_BORDER: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            false /** headerRow */,
            true /** firstColumn */,
            TableBorderFormat.onlyExternalHeaderRowAndFirstColumnBorders /** tableBorderFormat */,
            null /** bgColorEven */,
            lightColor /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            null /** headerRowColor */
        ),
    HEADER_ROW_AND_BANDED_ROWS_FIRST_COLUMN_LIST: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            null /** verticalColors*/,
            true /** bandedRows */,
            false /** bandedColumns */,
            true /** headerRow */,
            false /** firstColumn */,
            null /** tableBorderFormat */,
            lightColor /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            null /** bgColumnColorEven */,
            color /** headerRowColor */
        ),
    BANDED_COLUMNS: (color, lightColor) =>
        createTableFormat(
            null /**bgColor */,
            color /**topBorder */,
            color /**bottomBorder */,
            color /** verticalColors*/,
            false /** bandedRows */,
            true /** bandedColumns */,
            false /** headerRow */,
            false /** firstColumn */,
            null /** tableBorderFormat */,
            null /** bgColorEven */,
            null /** bgColorOdd */,
            null /** bgColumnColorOdd */,
            lightColor /** bgColumnColorEven */,
            null /** headerRowColor */
        ),
};

const PREDEFINED_STYLES_KEYS = {
    gridWithoutBorder: 'GRID_WITHOUT_BORDER',
    gridWithBorder: 'GRID_WITH_BORDER',
    headerRowWithBandedRows: 'HEADER_ROW_WITH_BANDED_ROWS',
    list: 'LIST',
    headerRow: 'HEADER_ROW',
    headerRowAndBandedRowsFirstColumn: 'HEADER_ROW_AND_BANDED_ROWS_FIRST_COLUMN',
    headerRowAndBandedRowsFirstColumnList: 'HEADER_ROW_AND_BANDED_ROWS_FIRST_COLUMN_LIST',
    banded_columns: 'BANDED_COLUMNS',
    bandedRowsFirstColumn: 'BANDED_ROWS_FIRST_COLUMN',
    bandedRowsFirstColumnNoBorder: 'BANDED_ROWS_FIRST_COLUMN_NO_BORDER',
};

const TABLE_COLORS: Record<string, string> = {
    transparent: 'transparent',
    black: '#000000',
    blue: '#0C64C0',
    orange: '#DE6A19',
    yellow: '#DCBE22',
    red: '#ED5C57',
    purple: '#B36AE2',
    green: '#0C882A',
};

interface VTablePaneState {
    vtable: VTable;
}

const styles = require('./VTablePane.scss');

function TableCell(props: {
    cell: VCell;
    editor: IEditor;
    isCurrent: boolean;
    onClickCell: (td: HTMLTableCellElement) => void;
}) {
    const { cell, editor, isCurrent } = props;
    const onMouseOver = React.useCallback(() => {
        editor.select(cell.td);
    }, [cell, editor]);
    const onClick = React.useCallback(() => {
        if (cell.td) {
            props.onClickCell(cell.td);
        }
    }, [cell, editor]);

    const text = cell.td
        ? getTagOfNode(cell.td)
        : cell.spanAbove && cell.spanLeft
        ? '↖'
        : cell.spanAbove
        ? '↑'
        : cell.spanLeft
        ? '←'
        : '';

    return (
        <div
            style={{ cursor: 'pointer', border: isCurrent ? 'solid 2px black' : '' }}
            onMouseOver={onMouseOver}
            onClick={onClick}>
            {text}
        </div>
    );
}

export default class VTablePane extends React.Component<ApiPaneProps, VTablePaneState> {
    private bgColor = React.createRef<HTMLInputElement>();
    private topBorderColor = React.createRef<HTMLInputElement>();
    private bottomBorderColor = React.createRef<HTMLInputElement>();
    private verticalBorderColor = React.createRef<HTMLInputElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            vtable: null,
        };
    }

    render() {
        const editor = this.props.getEditor();
        const currentTd = this.state.vtable?.getCurrentTd();
        return (
            <>
                <button onClick={this.createVTable}>Create VTable from cursor</button>
                {this.state.vtable && (
                    <>
                        <table
                            style={{
                                border: 'solid 1px black',
                            }}>
                            {this.state.vtable.cells.map(row => (
                                <tr>
                                    {row.map(cell => (
                                        <td>
                                            <TableCell
                                                cell={cell}
                                                editor={editor}
                                                isCurrent={currentTd == cell.td}
                                                onClickCell={this.onClickCell}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </table>
                        <table>
                            <tr>
                                <th colSpan={2}>Edit Table</th>
                            </tr>
                            <tr>
                                <td>Insert</td>
                                <td>
                                    {this.renderEditTableButton(
                                        'Above',
                                        TableOperation.InsertAbove
                                    )}
                                    {this.renderEditTableButton(
                                        'Below',
                                        TableOperation.InsertBelow
                                    )}
                                    {this.renderEditTableButton('Left', TableOperation.InsertLeft)}
                                    {this.renderEditTableButton(
                                        'Right',
                                        TableOperation.InsertRight
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Delete</td>
                                <td>
                                    {this.renderEditTableButton(
                                        'Table',
                                        TableOperation.DeleteTable
                                    )}
                                    {this.renderEditTableButton(
                                        'Column',
                                        TableOperation.DeleteColumn
                                    )}
                                    {this.renderEditTableButton('Row', TableOperation.DeleteRow)}
                                </td>
                            </tr>
                            <tr>
                                <td>Merge</td>
                                <td>
                                    {this.renderEditTableButton('Above', TableOperation.MergeAbove)}
                                    {this.renderEditTableButton('Below', TableOperation.MergeBelow)}
                                    {this.renderEditTableButton('Left', TableOperation.MergeLeft)}
                                    {this.renderEditTableButton('Right', TableOperation.MergeRight)}
                                </td>
                            </tr>
                            <tr>
                                <td>Split</td>
                                <td>
                                    {this.renderEditTableButton(
                                        'Horizontally',
                                        TableOperation.SplitHorizontally
                                    )}
                                    {this.renderEditTableButton(
                                        'Vertically',
                                        TableOperation.SplitVertically
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Align</td>
                                <td>
                                    {this.renderEditTableButton('Left', TableOperation.AlignLeft)}
                                    {this.renderEditTableButton(
                                        'Center',
                                        TableOperation.AlignCenter
                                    )}
                                    {this.renderEditTableButton('Right', TableOperation.AlignRight)}
                                </td>
                            </tr>
                            <tr>
                                <td>Align Cell</td>
                                <td>
                                    {this.renderEditTableButton(
                                        'Left',
                                        TableOperation.AlignCellLeft
                                    )}
                                    {this.renderEditTableButton(
                                        'Center',
                                        TableOperation.AlignCellCenter
                                    )}
                                    {this.renderEditTableButton(
                                        'Right',
                                        TableOperation.AlignCellRight
                                    )}
                                    {this.renderEditTableButton('Top', TableOperation.AlignCellTop)}
                                    {this.renderEditTableButton(
                                        'Middle',
                                        TableOperation.AlignCellMiddle
                                    )}
                                    {this.renderEditTableButton(
                                        'Bottom',
                                        TableOperation.AlignCellBottom
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2}>Format Table</th>
                            </tr>
                            <tr>
                                <td>State:</td>
                                <td>{this.renderSetHeaderRowButton(editor)}</td>
                                <td>{this.renderSetFirstColumnButton(editor)}</td>
                                <td>{this.renderSetBandedColumnButton(editor)}</td>
                                <td>{this.renderSetBandedRowButton(editor)}</td>
                            </tr>
                            <tr>
                                <td>Predefined:</td>
                                <td>
                                    {this.renderFormatTableButton(
                                        'Grid with border',
                                        PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.gridWithBorder](
                                            TABLE_COLORS.blue,
                                            `${TABLE_COLORS.blue}20`
                                        ),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Grid without border',
                                        PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.gridWithoutBorder](
                                            TABLE_COLORS.blue,
                                            `${TABLE_COLORS.blue}20`
                                        ),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Header Row',
                                        PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.headerRow](
                                            TABLE_COLORS.blue,
                                            `${TABLE_COLORS.blue}20`
                                        ),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Header Row and Banded Rows First Column',
                                        PREDEFINED_STYLES[
                                            PREDEFINED_STYLES_KEYS.headerRowAndBandedRowsFirstColumn
                                        ](TABLE_COLORS.blue, `${TABLE_COLORS.blue}20`),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Header Row and Banded First Column List',
                                        PREDEFINED_STYLES[
                                            PREDEFINED_STYLES_KEYS
                                                .headerRowAndBandedRowsFirstColumnList
                                        ](TABLE_COLORS.blue, `${TABLE_COLORS.blue}20`),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Header Row with Banded Rows',
                                        PREDEFINED_STYLES[
                                            PREDEFINED_STYLES_KEYS.headerRowWithBandedRows
                                        ](TABLE_COLORS.blue, `${TABLE_COLORS.blue}20`),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'List',
                                        PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.list](
                                            TABLE_COLORS.blue,
                                            `${TABLE_COLORS.blue}20`
                                        ),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Banded Columns',
                                        PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.banded_columns](
                                            TABLE_COLORS.blue,
                                            `${TABLE_COLORS.blue}20`
                                        ),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Banded Row and first column',
                                        PREDEFINED_STYLES[
                                            PREDEFINED_STYLES_KEYS.bandedRowsFirstColumn
                                        ](TABLE_COLORS.blue, `${TABLE_COLORS.blue}20`),
                                        editor
                                    )}
                                    {this.renderFormatTableButton(
                                        'Banded Row and first column and no border',
                                        PREDEFINED_STYLES[
                                            PREDEFINED_STYLES_KEYS.bandedRowsFirstColumnNoBorder
                                        ](TABLE_COLORS.blue, `${TABLE_COLORS.blue}20`),
                                        editor
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} className={styles.buttonRow}>
                                    Customized Colors:
                                </th>
                            </tr>
                            <CustomizeFormatRow text="BackgroundColor" inputRef={this.bgColor} />
                            <CustomizeFormatRow text="Top border" inputRef={this.topBorderColor} />
                            <CustomizeFormatRow
                                text="Bottom border"
                                inputRef={this.bottomBorderColor}
                            />
                            <CustomizeFormatRow
                                text="Vertical border"
                                inputRef={this.verticalBorderColor}
                            />

                            <tr>
                                <td
                                    colSpan={2}
                                    className={styles.buttonRow}
                                    onClick={this.onCustomizeFormat}>
                                    <button className={styles.button}>Apply Format</button>
                                </td>
                            </tr>

                            <tr>
                                <th colSpan={2} className={styles.buttonRow}>
                                    Style Info:
                                </th>
                            </tr>
                        </table>
                        <button onClick={this.onWriteBack}>Write back</button>
                    </>
                )}
            </>
        );
    }

    private createVTable = () => {
        const editor = this.props.getEditor();
        const node = editor.getElementAtCursor('td,th') as HTMLTableCellElement;
        const vtable = node ? new VTable(node) : null;

        this.setState({ vtable });
    };

    private onClickCell = (td: HTMLTableCellElement) => {
        const vtable = new VTable(td);
        this.setState({ vtable });
    };

    private renderEditTableButton(text: string, operation: TableOperation): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    this.state.vtable.edit(operation);
                    this.forceUpdate();
                }}>
                {text}
            </button>
        );
    }

    private renderSetHeaderRowButton(editor: IEditor): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    formatTable(
                        editor,
                        setHeaderRow(this.state.vtable.table),
                        this.state.vtable.table
                    );

                    this.forceUpdate();
                }}>
                Header Row
            </button>
        );
    }

    private renderSetFirstColumnButton(editor: IEditor): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    formatTable(
                        editor,
                        setFirstColumn(this.state.vtable.table),
                        this.state.vtable.table
                    );

                    this.forceUpdate();
                }}>
                First Column
            </button>
        );
    }
    private renderSetBandedColumnButton(editor: IEditor): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    formatTable(
                        editor,
                        setBandedColumn(this.state.vtable.table),
                        this.state.vtable.table
                    );

                    this.forceUpdate();
                }}>
                Banded Column
            </button>
        );
    }
    private renderSetBandedRowButton(editor: IEditor): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    formatTable(
                        editor,
                        setBandedRow(this.state.vtable.table),
                        this.state.vtable.table
                    );

                    this.forceUpdate();
                }}>
                Banded Row
            </button>
        );
    }

    private renderFormatTableButton(
        text: string,
        format: TableFormat,
        editor: IEditor
    ): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    saveTableInfo(this.state.vtable.table, format);
                    formatTable(editor, format, this.state.vtable.table);
                    this.forceUpdate();
                }}>
                {text}
            </button>
        );
    }

    private onCustomizeFormat = () => {
        const format = createTableFormat(
            this.bgColor.current.value || undefined,
            this.topBorderColor.current.value || undefined,
            this.bottomBorderColor.current.value || undefined,
            this.verticalBorderColor.current.value || undefined
        );

        this.state.vtable.applyFormat(format);
        this.forceUpdate();
    };

    private onWriteBack = () => {
        const editor = this.props.getEditor();
        editor.addUndoSnapshot(() => {
            const vtable = this.state.vtable;
            const td = vtable.getCurrentTd();
            vtable.writeBack();
            editor.focus();
            editor.select(td, PositionType.Begin);
        });
        this.createVTable();
    };
}

function createTableFormat(
    bgColor?: string,
    topBorder?: string,
    bottomBorder?: string,
    verticalBorder?: string,
    bandedRows?: boolean,
    bandedColumns?: boolean,
    headerRow?: boolean,
    firstColumn?: boolean,
    borderFormat?: TableBorderFormat,
    bgColorEven?: string,
    bgColorOdd?: string,
    bgColumnColorEven?: string,
    bgColumnColorOdd?: string,
    headerRowColor?: string
): TableFormat {
    return {
        bgColor: bgColor,
        topBorderColor: topBorder,
        bottomBorderColor: bottomBorder,
        verticalBorderColor: verticalBorder,
        bandedRows: bandedRows,
        bgColorEven: bgColorEven,
        bgColorOdd: bgColorOdd,
        bandedColumns: bandedColumns,
        bgColumnColorEven: bgColumnColorEven,
        bgColumnColorOdd: bgColumnColorOdd,
        headerRow: headerRow,
        headerRowColor: headerRowColor,
        firstColumn: firstColumn,
        tableBorderFormat: borderFormat,
    };
}

function setHeaderRow(table: HTMLTableElement): Partial<TableFormat> {
    const format = getTableFormatInfo(table);
    format.headerRow = !format.headerRow;
    if (format.headerRow) {
        format.headerRowColor = format.bottomBorderColor;
    }
    saveTableInfo(table, format);
    return format;
}

function setFirstColumn(table: HTMLTableElement): Partial<TableFormat> {
    const format = getTableFormatInfo(table);
    format.firstColumn = !format.firstColumn;
    saveTableInfo(table, format);
    return format;
}

function setBandedColumn(table: HTMLTableElement): Partial<TableFormat> {
    const format = getTableFormatInfo(table);
    format.bandedColumns = !format.bandedColumns;
    if (format.bandedColumns) {
        const lightColor = `${format.bottomBorderColor}20`;
        format.bgColumnColorOdd !== format.bgColor
            ? (format.bgColumnColorOdd = lightColor)
            : (format.bgColumnColorEven = lightColor);
    } else {
        format.bgColumnColorOdd === format.bgColor
            ? (format.bgColumnColorEven = format.bgColor)
            : (format.bgColumnColorOdd = format.bgColor);
    }
    saveTableInfo(table, format);
    return format;
}

function setBandedRow(table: HTMLTableElement): Partial<TableFormat> {
    const format = getTableFormatInfo(table);
    format.bandedRows = !format.bandedRows;
    if (format.bandedRows) {
        const lightColor = `${format.bottomBorderColor}20`;
        format.bgColorOdd !== format.bgColor
            ? (format.bgColorOdd = lightColor)
            : (format.bgColorEven = lightColor);
    } else {
        format.bgColorOdd === format.bgColor
            ? (format.bgColorEven = format.bgColor)
            : (format.bgColorOdd = format.bgColor);
    }
    saveTableInfo(table, format);
    return format;
}

function CustomizeFormatRow(props: { text: string; inputRef: React.RefObject<HTMLInputElement> }) {
    const [isColorPickerShowing, setIsColorPickerShowing] = React.useState(false);
    const onShowColorPicker = React.useCallback(() => {
        setIsColorPickerShowing(!isColorPickerShowing);
    }, [isColorPickerShowing]);
    const setColor = React.useCallback((color: Color) => {
        props.inputRef.current.value = color.hex().toString();
    }, []);
    let color: Color;
    try {
        color = Color(props.inputRef.current.value);
    } catch {
        color = Color('white');
    }
    return (
        <>
            <tr>
                <td className={styles.label}>
                    <button onClick={onShowColorPicker}>{props.text}</button>
                </td>
                <td>
                    <input type="text" ref={props.inputRef} />
                </td>
            </tr>
            {isColorPickerShowing && (
                <tr>
                    <td colSpan={2}>
                        <ColorPicker initColor={color} onSelect={setColor} />
                    </td>
                </tr>
            )}
        </>
    );
}
