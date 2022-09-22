import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import {
    PluginEvent,
    PluginEventType,
    SelectionRangeEx,
    SelectionRangeTypes,
    TableSelection,
} from 'roosterjs-editor-types';

interface SelectionPaneState {
    selection: SelectionRangeEx;
    selectionMessage: string;
    isImageSelectionOption: boolean;
    manualSelect: boolean;
}

const styles = require('./getSelectionPane.scss');

export default class GetSelectionPane extends React.Component<ApiPaneProps, SelectionPaneState> {
    private selectInfo = React.createRef<HTMLInputElement>();
    private editor = this.props.getEditor();
    private firstCellX = React.createRef<HTMLInputElement>();
    private firstCellY = React.createRef<HTMLInputElement>();
    private lastCellX = React.createRef<HTMLInputElement>();
    private lastCellY = React.createRef<HTMLInputElement>();
    private selectionType: Record<string, string> = {
        [SelectionRangeTypes.Normal]: 'Normal',
        [SelectionRangeTypes.TableSelection]: 'Table Selection',
        [SelectionRangeTypes.ImageSelection]: 'Image Selection',
    };

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            selection: null,
            selectionMessage: '',
            isImageSelectionOption: true,
            manualSelect: false,
        };
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.SelectionChanged && !this.state.manualSelect) {
            this.updateSelection();
        }
    }

    private updateSelection = () => {
        this.setState({
            selection: this.editor ? this.editor.getSelectionRangeEx() : null,
        });
    };

    private selectElement = () => {
        const queryInfo = this.selectInfo.current.value;
        if (queryInfo) {
            if (this.state.isImageSelectionOption) {
                const elementToSelect = this.editor
                    .getDocument()
                    .querySelector(`img[id$="${queryInfo}"]`);
                const select = elementToSelect ? this.editor.select(elementToSelect) : null;
                this.setState({
                    selection: select ? this.editor.getSelectionRangeEx() : null,
                    selectionMessage: select ? 'Image Found' : 'Image not found',
                });
            } else {
                const elementToSelect = this.editor
                    .getDocument()
                    .querySelector(`table[id$="${queryInfo}"]`) as HTMLTableElement;
                const coordinates = this.getCoordinates();
                const select =
                    elementToSelect && coordinates
                        ? this.editor.select(elementToSelect, coordinates)
                        : null;
                this.setState({
                    selection: select ? this.editor.getSelectionRangeEx() : null,
                    selectionMessage: select ? 'Table found' : 'Table not found',
                });
            }
        }
    };

    private getCoordinates = (): TableSelection => {
        if (
            this.firstCellX.current.value &&
            this.firstCellY.current.value &&
            this.lastCellX.current.value &&
            this.lastCellY.current.value
        ) {
            const coordinates: TableSelection = {
                firstCell: {
                    x: parseInt(this.firstCellX.current.value),
                    y: parseInt(this.firstCellY.current.value),
                },
                lastCell: {
                    x: parseInt(this.lastCellX.current.value),
                    y: parseInt(this.lastCellY.current.value),
                },
            };
            return coordinates;
        }
        return null;
    };

    private createSelectionInfo = () => {
        return (
            <>
                <div className={styles.containerInfo}>
                    <span className={styles.title}>Selection Information</span>
                    <div>Selection type: {this.selectionType[this.state.selection.type]}</div>
                    <div>Are collapsed: {`${this.state.selection.areAllCollapsed}`}</div>
                    {this.state.selection.type === SelectionRangeTypes.TableSelection && (
                        <>
                            <div>Coordinates</div>
                            <div>
                                First cell:
                                <span> X: {this.state.selection.coordinates.firstCell.x}</span>
                                <span> Y: {this.state.selection.coordinates.firstCell.y}</span>
                            </div>
                            <div>
                                Last cell:
                                <span> X: {this.state.selection.coordinates.lastCell.x}</span>
                                <span> Y: {this.state.selection.coordinates.lastCell.y}</span>
                            </div>
                        </>
                    )}
                    {this.state.selection.type === SelectionRangeTypes.ImageSelection && (
                        <>
                            <div>Image Id: {this.state.selection.image.id}</div>
                        </>
                    )}
                </div>
            </>
        );
    };

    private selectionOption = (label: string, checked: boolean, onChange: () => void) => {
        return (
            <>
                <div>
                    <label>
                        <input
                            className={styles.input}
                            type="radio"
                            checked={checked}
                            onChange={onChange}
                        />
                        {label}
                    </label>
                </div>
            </>
        );
    };

    private changeSelectionOption = () => {
        this.setState({
            isImageSelectionOption: !this.state.isImageSelectionOption,
        });
    };

    private createCoordinatesInput = (
        label: string,
        coordinateRef: React.RefObject<HTMLInputElement>
    ) => {
        return (
            <>
                <div>
                    <label>
                        {label}
                        <input
                            className={styles.coordinates}
                            min="0"
                            type="number"
                            ref={coordinateRef}
                        />
                    </label>
                </div>
            </>
        );
    };

    private showManualSelection = () => {
        this.setState({
            manualSelect: !this.state.manualSelect,
        });
    };

    render() {
        return (
            <>
                {!this.state.manualSelect && (
                    <span className={styles.title}>
                        Click on the screen to get selection information
                    </span>
                )}
                {this.state.selection && <span>{this.createSelectionInfo()}</span>}
                {this.state.manualSelect && (
                    <div className={styles.containerInfo}>
                        <div>
                            <span className={styles.title}>Select element type:</span>
                            {this.selectionOption(
                                'Image',
                                this.state.isImageSelectionOption,
                                this.changeSelectionOption
                            )}
                            {this.selectionOption(
                                'Table',
                                !this.state.isImageSelectionOption,
                                this.changeSelectionOption
                            )}
                            <input
                                className={styles.input}
                                placeholder="Type element id:"
                                type="input"
                                ref={this.selectInfo}
                            />
                            {!this.state.isImageSelectionOption && (
                                <div>
                                    <div> Coordinates </div>
                                    {this.createCoordinatesInput('First cell X', this.firstCellX)}
                                    {this.createCoordinatesInput('First cell Y', this.firstCellY)}
                                    {this.createCoordinatesInput('Last cell X', this.lastCellX)}
                                    {this.createCoordinatesInput('Last cell X', this.lastCellY)}
                                </div>
                            )}
                        </div>
                        <div>{this.state.selectionMessage}</div>
                        <div>
                            {this.selectInfo && (
                                <button className={styles.button} onClick={this.selectElement}>
                                    Select Element
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <button className={styles.button} onClick={this.showManualSelection}>
                    {this.state.manualSelect ? 'Hide manual select' : 'Show manual select'}
                </button>
            </>
        );
    }
}
