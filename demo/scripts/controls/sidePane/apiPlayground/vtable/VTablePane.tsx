import * as Color from 'color';
import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import ColorPicker from '../../../colorPicker/ColorPicker';
import { getTagOfNode, VTable } from 'roosterjs-editor-dom';
import { IEditor, PositionType, TableFormat, TableOperation, VCell } from 'roosterjs-editor-types';

const TABLE_FORMAT = {
    default: createTableFormat('#FFF', '#FFF', '#ABABAB', '#ABABAB', '#ABABAB'),
    lightLines: createTableFormat('#FFF', '#FFF', null, '#92C0E0'),
    towTones: createTableFormat('#C0E4FF', '#FFF'),
    lightBands: createTableFormat('#D8D8D8', '#FFF'),
    grid: createTableFormat('#D8D8D8', '#FFF', '#ABABAB', '#ABABAB', '#ABABAB'),
    clear: createTableFormat('#FFF', '#FFF'),
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
    isSelected: boolean;
}) {
    const { cell, editor, isCurrent, isSelected } = props;
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
            style={{
                cursor: 'pointer',
                border: isCurrent ? 'solid 2px black' : '',
                backgroundColor: isSelected ? 'blue' : 'white',
            }}
            onMouseOver={onMouseOver}
            onClick={onClick}>
            {text}
        </div>
    );
}

export default class VTablePane extends React.Component<ApiPaneProps, VTablePaneState> {
    private evenBgColor = React.createRef<HTMLInputElement>();
    private oddBgColor = React.createRef<HTMLInputElement>();
    private topBorderColor = React.createRef<HTMLInputElement>();
    private bottomBorderColor = React.createRef<HTMLInputElement>();
    private verticalBorderColor = React.createRef<HTMLInputElement>();
    private applyBackgroundColor = React.createRef<HTMLInputElement>();

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
                                                isSelected={cell.selected}
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
                                <td>Predefined:</td>
                                <td>
                                    {this.renderFormatTableButton('Default', TABLE_FORMAT.default)}
                                    {this.renderFormatTableButton('Grid', TABLE_FORMAT.grid)}
                                    {this.renderFormatTableButton(
                                        'Light lines',
                                        TABLE_FORMAT.lightLines
                                    )}
                                    {this.renderFormatTableButton(
                                        'Two tones',
                                        TABLE_FORMAT.towTones
                                    )}
                                    {this.renderFormatTableButton(
                                        'Light bands',
                                        TABLE_FORMAT.lightBands
                                    )}
                                    {this.renderFormatTableButton('Clear', TABLE_FORMAT.clear)}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2} className={styles.buttonRow}>
                                    Customized Colors:
                                </th>
                            </tr>
                            <CustomizeFormatRow text="Even row" inputRef={this.evenBgColor} />
                            <CustomizeFormatRow text="Odd row" inputRef={this.oddBgColor} />
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
                        </table>
                        <button onClick={this.onWriteBack}>Write back</button>
                        <hr />
                        <table>
                            <CustomizeFormatRow
                                text="Background Color"
                                inputRef={this.applyBackgroundColor}
                            />

                            <tr>
                                <td
                                    colSpan={2}
                                    className={styles.buttonRow}
                                    onClick={this.onApplyBackgroundColorClick}>
                                    <button className={styles.button}>
                                        Apply Background Color on Selection
                                    </button>
                                </td>
                            </tr>
                        </table>
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

    private renderFormatTableButton(text: string, format: TableFormat): JSX.Element {
        return (
            <button
                className={styles.button}
                onClick={() => {
                    this.state.vtable.applyFormat(format);
                    this.forceUpdate();
                }}>
                {text}
            </button>
        );
    }

    private onCustomizeFormat = () => {
        const format = createTableFormat(
            this.evenBgColor.current.value || undefined,
            this.oddBgColor.current.value || undefined,
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

    private onApplyBackgroundColorClick = () => {
        const editor = this.props.getEditor();
        editor.addUndoSnapshot(() => {
            const vtable = this.state.vtable;
            vtable.setBackgroundColor(this.applyBackgroundColor.current.value);
            editor.focus();
        });
        this.createVTable();
    };
}

function createTableFormat(
    bgColorEven?: string,
    bgColorOdd?: string,
    topBorder?: string,
    bottomBorder?: string,
    verticalBorder?: string
): TableFormat {
    return {
        bgColorEven: bgColorEven,
        bgColorOdd: bgColorOdd,
        topBorderColor: topBorder,
        bottomBorderColor: bottomBorder,
        verticalBorderColor: verticalBorder,
    };
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
