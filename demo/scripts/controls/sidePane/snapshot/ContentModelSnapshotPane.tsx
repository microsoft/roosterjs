import * as React from 'react';
import { EntityState, UndoSnapshot, UndoSnapshotSelection } from 'roosterjs-content-model-types';
import { ModeIndependentColor } from 'roosterjs-editor-types';

const styles = require('./SnapshotPane.scss');

export interface ContentModelSnapshotPaneProps {
    onTakeSnapshot: () => UndoSnapshot;
    onRestoreSnapshot: (snapshot: UndoSnapshot, triggerContentChangedEvent: boolean) => void;
    onMove: (moveStep: number) => void;
}

export interface ContentModelSnapshotPaneState {
    snapshots: UndoSnapshot[];
    currentIndex: number;
    autoCompleteIndex: number;
}

export default class ContentModelSnapshotPane extends React.Component<
    ContentModelSnapshotPaneProps,
    ContentModelSnapshotPaneState
> {
    private html = React.createRef<HTMLTextAreaElement>();
    private knownColors = React.createRef<HTMLTextAreaElement>();
    private entityStates = React.createRef<HTMLTextAreaElement>();
    private isDarkColor = React.createRef<HTMLInputElement>();
    private selection = React.createRef<HTMLTextAreaElement>();

    constructor(props: ContentModelSnapshotPaneProps) {
        super(props);

        this.state = {
            snapshots: [],
            currentIndex: -1,
            autoCompleteIndex: -1,
        };
    }

    render() {
        return (
            <div className={styles.snapshotPane}>
                <h3>Undo Snapshots</h3>
                <div className={styles.snapshotList}>
                    {this.state.snapshots.map(this.renderItem)}
                </div>
                <h3>Selected Snapshot</h3>
                <div className={styles.buttons}>
                    <button onClick={this.takeSnapshot}>{'Take snapshot'}</button>{' '}
                    <button onClick={this.onClickRestoreSnapshot}>{'Restore snapshot'}</button>
                </div>
                <div>HTML:</div>
                <textarea ref={this.html} className={styles.textarea} spellCheck={false} />
                <div>Selection:</div>
                <textarea ref={this.selection} className={styles.textarea} spellCheck={false} />
                <div>Entity states:</div>
                <textarea ref={this.entityStates} className={styles.textarea} spellCheck={false} />
                <div>Known colors:</div>
                <textarea ref={this.knownColors} className={styles.textarea} spellCheck={false} />
                <div>
                    <input type="checkbox" ref={this.isDarkColor} id="isUndoInDarkColor" />
                    <label htmlFor="isUndoInDarkColor">Is in dark mode</label>
                </div>
            </div>
        );
    }

    private onClickRestoreSnapshot = () => {
        const html = this.html.current.value;
        const selection = this.selection.current.value
            ? (JSON.parse(this.selection.current.value) as UndoSnapshotSelection)
            : undefined;
        const knownColors = this.knownColors.current.value
            ? (JSON.parse(this.knownColors.current.value) as ModeIndependentColor[])
            : [];
        const entityStates = this.entityStates.current.value
            ? (JSON.parse(this.entityStates.current.value) as EntityState[])
            : undefined;
        const isDarkMode = !!this.isDarkColor.current.checked;

        this.props.onRestoreSnapshot(
            {
                html,
                knownColors,
                entityStates,
                isDarkMode,
                selection,
            },
            true
        );
    };

    updateSnapshots(snapshots: UndoSnapshot[], currentIndex: number, autoCompleteIndex: number) {
        this.setState({
            snapshots,
            currentIndex,
            autoCompleteIndex,
        });
    }

    snapshotToString(snapshot: UndoSnapshot) {
        return (
            snapshot.html +
            (snapshot.selection ? `<!--${JSON.stringify(snapshot.selection)}-->` : '')
        );
    }

    private takeSnapshot = () => {
        const snapshot = this.props.onTakeSnapshot();
        this.setSnapshot(snapshot);
    };

    private setSnapshot = (snapshot: UndoSnapshot) => {
        this.html.current.value = snapshot.html;
        this.entityStates.current.value = snapshot.entityStates
            ? JSON.stringify(snapshot.entityStates)
            : '';
        this.knownColors.current.value = snapshot.knownColors
            ? JSON.stringify(snapshot.knownColors)
            : '';
        this.selection.current.value = snapshot.selection ? JSON.stringify(snapshot.selection) : '';
        this.isDarkColor.current.checked = !!snapshot.isDarkMode;
    };

    private renderItem = (snapshot: UndoSnapshot, index: number) => {
        let className = '';
        if (index == this.state.currentIndex) {
            className += ' ' + styles.current;
        }
        if (index == this.state.autoCompleteIndex) {
            className += ' ' + styles.autoComplete;
        }

        const snapshotStr = this.snapshotToString(snapshot);
        return (
            <pre
                className={className}
                key={index}
                onClick={() => this.setSnapshot(snapshot)}
                onDoubleClick={() => this.props.onMove(index - this.state.currentIndex)}>
                {(snapshotStr || '<EMPTY SNAPSHOT>').substring(0, 1000)}
            </pre>
        );
    };
}
