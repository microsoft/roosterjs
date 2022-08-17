import * as Color from 'color';
import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import ColorPicker from '../../../colorPicker/ColorPicker';
import { createTableFormat, PREDEFINED_STYLES } from '../../shared/PredefinedTableStyles';
import { editTable, formatTable } from 'roosterjs-editor-api';
import { getTagOfNode, VTable } from 'roosterjs-editor-dom';
import { IEditor, PositionType, TableFormat, TableOperation, VCell } from 'roosterjs-editor-types';

const PREDEFINED_STYLES_KEYS = {
    default: 'DEFAULT',
    gridWithoutBorder: 'GRID_WITHOUT_BORDER',
    list: 'LIST',
    bandedRowsFirstColumnNoBorder: 'BANDED_ROWS_FIRST_COLUMN_NO_BORDER',
    defaultWithBackgroundColor: 'DEFAULT_WITH_BACKGROUND_COLOR',
    external: 'EXTERNAL',
    noHeader: 'NO_HEADER_VERTICAL',
    especialType1: 'ESPECIAL_TYPE_1',
    especialType2: 'ESPECIAL_TYPE_2',
    especialType3: 'ESPECIAL_TYPE_3',
    clear: 'CLEAR',
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
                            <tbody>
                                {this.state.vtable.cells.map((row, rowIndex) => (
                                    <tr key={'row' + rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={'cell' + cellIndex}>
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
                            </tbody>
                        </table>
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan={2}>Edit Table</th>
                                </tr>
                                <tr>
                                    <td>Insert</td>
                                    <td>
                                        {this.renderEditTableButton(
                                            editor,
                                            'Above',
                                            TableOperation.InsertAbove
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Below',
                                            TableOperation.InsertBelow
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Left',
                                            TableOperation.InsertLeft
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Right',
                                            TableOperation.InsertRight
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Delete</td>
                                    <td>
                                        {this.renderEditTableButton(
                                            editor,
                                            'Table',
                                            TableOperation.DeleteTable
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Column',
                                            TableOperation.DeleteColumn
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Row',
                                            TableOperation.DeleteRow
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Merge</td>
                                    <td>
                                        {this.renderEditTableButton(
                                            editor,
                                            'Above',
                                            TableOperation.MergeAbove
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Below',
                                            TableOperation.MergeBelow
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Left',
                                            TableOperation.MergeLeft
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Right',
                                            TableOperation.MergeRight
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Split</td>
                                    <td>
                                        {this.renderEditTableButton(
                                            editor,
                                            'Horizontally',
                                            TableOperation.SplitHorizontally
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Vertically',
                                            TableOperation.SplitVertically
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Align</td>
                                    <td>
                                        {this.renderEditTableButton(
                                            editor,
                                            'Left',
                                            TableOperation.AlignLeft
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Center',
                                            TableOperation.AlignCenter
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Right',
                                            TableOperation.AlignRight
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Align Cell</td>
                                    <td>
                                        {this.renderEditTableButton(
                                            editor,
                                            'Left',
                                            TableOperation.AlignCellLeft
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Center',
                                            TableOperation.AlignCellCenter
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Right',
                                            TableOperation.AlignCellRight
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Top',
                                            TableOperation.AlignCellTop
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
                                            'Middle',
                                            TableOperation.AlignCellMiddle
                                        )}
                                        {this.renderEditTableButton(
                                            editor,
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
                                    <td>
                                        {this.renderSetHeaderRowButton(editor)}
                                        {this.renderSetFirstColumnButton(editor)}
                                        {this.renderSetBandedColumnButton(editor)}
                                        {this.renderSetBandedRowButton(editor)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Predefined:</td>
                                    <td>
                                        {this.renderFormatTableButton(
                                            'Default',
                                            PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.default](
                                                TABLE_COLORS.blue,
                                                `${TABLE_COLORS.blue}20`
                                            ),
                                            editor
                                        )}

                                        {this.renderFormatTableButton(
                                            'Grid without border',
                                            PREDEFINED_STYLES[
                                                PREDEFINED_STYLES_KEYS.gridWithoutBorder
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
                                            'Banded Row and first column and no border',
                                            PREDEFINED_STYLES[
                                                PREDEFINED_STYLES_KEYS.bandedRowsFirstColumnNoBorder
                                            ](TABLE_COLORS.blue, `${TABLE_COLORS.blue}20`),
                                            editor
                                        )}
                                        {this.renderFormatTableButton(
                                            'Default with background color',
                                            PREDEFINED_STYLES[
                                                PREDEFINED_STYLES_KEYS.defaultWithBackgroundColor
                                            ](TABLE_COLORS.blue, `${TABLE_COLORS.blue}20`),
                                            editor
                                        )}
                                        {this.renderFormatTableButton(
                                            'External',
                                            PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.external](
                                                TABLE_COLORS.blue,
                                                `${TABLE_COLORS.blue}20`
                                            ),
                                            editor
                                        )}
                                        {this.renderFormatTableButton(
                                            'No Header Vertical',
                                            PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.noHeader](
                                                TABLE_COLORS.blue,
                                                `${TABLE_COLORS.blue}20`
                                            ),
                                            editor
                                        )}
                                        {this.renderFormatTableButton(
                                            'Especial type 1',
                                            PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.especialType1](
                                                TABLE_COLORS.blue,
                                                `${TABLE_COLORS.blue}20`
                                            ),
                                            editor
                                        )}
                                        {this.renderFormatTableButton(
                                            'Especial type 2',
                                            PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.especialType2](
                                                TABLE_COLORS.blue,
                                                `${TABLE_COLORS.blue}20`
                                            ),
                                            editor
                                        )}
                                        {this.renderFormatTableButton(
                                            'Especial type 3',
                                            PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.especialType3](
                                                TABLE_COLORS.blue,
                                                `${TABLE_COLORS.blue}20`
                                            ),
                                            editor
                                        )}
                                        {this.renderFormatTableButton(
                                            'Clear',
                                            PREDEFINED_STYLES[PREDEFINED_STYLES_KEYS.clear](
                                                TABLE_COLORS.transparent
                                            ),
                                            editor
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan={2} className={styles.buttonRow}>
                                        Customized Colors:
                                    </th>
                                </tr>
                                <CustomizeFormatRow
                                    text="BackgroundColor"
                                    inputRef={this.bgColor}
                                />
                                <CustomizeFormatRow
                                    text="Top border"
                                    inputRef={this.topBorderColor}
                                />
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
                            </tbody>
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

    private renderEditTableButton(
        editor: IEditor,
        text: string,
        operation: TableOperation
    ): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    editTable(editor, operation);
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
                    formatTable(editor, format, this.state.vtable.table);
                    this.forceUpdate();
                }}>
                {text}
            </button>
        );
    }

    private onCustomizeFormat = () => {
        const format = createTableFormat(
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

function setHeaderRow(table: HTMLTableElement): TableFormat {
    const vtable = new VTable(table);
    const format = vtable.formatInfo;
    format.keepCellShade = true;
    format.hasHeaderRow = !format.hasHeaderRow;

    return format;
}

function setFirstColumn(table: HTMLTableElement): TableFormat {
    const vtable = new VTable(table);
    const format = vtable.formatInfo;
    format.keepCellShade = true;
    format.hasFirstColumn = !format.hasFirstColumn;
    return format;
}

function setBandedColumn(table: HTMLTableElement): TableFormat {
    const vtable = new VTable(table);
    const format = vtable.formatInfo;
    format.keepCellShade = true;
    format.hasBandedColumns = !format.hasBandedColumns;
    return format;
}

function setBandedRow(table: HTMLTableElement): TableFormat {
    const vtable = new VTable(table);
    const format = vtable.formatInfo;
    format.keepCellShade = true;
    format.hasBandedRows = !format.hasBandedRows;
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
