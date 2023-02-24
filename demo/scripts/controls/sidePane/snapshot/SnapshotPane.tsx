import * as React from 'react';
import { Snapshot } from 'roosterjs-editor-types';

const styles = require('./SnapshotPane.scss');

export interface SnapshotPaneProps {
    onTakeSnapshot: () => Snapshot;
    onRestoreSnapshot: (snapshot: Snapshot) => void;
    onMove: (moveStep: number) => void;
}

export interface SnapshotPaneState {
    snapshots: Snapshot[];
    currentIndex: number;
    autoCompleteIndex: number;
}

export default class SnapshotPane extends React.Component<SnapshotPaneProps, SnapshotPaneState> {
    private textarea: HTMLTextAreaElement;

    constructor(props: SnapshotPaneProps) {
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
                    <button
                        onClick={() =>
                            this.props.onRestoreSnapshot({
                                html: this.textarea.value,
                                metadata: null,
                                knownColors: [],
                            })
                        }>
                        {'Restore snapshot'}
                    </button>
                </div>
                <textarea
                    ref={ref => (this.textarea = ref)}
                    className={styles.textarea}
                    spellCheck={false}
                />
            </div>
        );
    }

    updateSnapshots(snapshots: Snapshot[], currentIndex: number, autoCompleteIndex: number) {
        this.setState({
            snapshots,
            currentIndex,
            autoCompleteIndex,
        });
    }

    snapshotToString(snapshot: Snapshot) {
        return (
            snapshot.html + (snapshot.metadata ? `<!--${JSON.stringify(snapshot.metadata)}-->` : '')
        );
    }

    private takeSnapshot = () => {
        const snapshot = this.props.onTakeSnapshot();
        this.setSnapshot(this.snapshotToString(snapshot));
    };

    private setSnapshot = (snapshot: string) => {
        this.textarea.value = snapshot;
    };

    private renderItem = (snapshot: Snapshot, index: number) => {
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
                onClick={() => this.setSnapshot(snapshotStr)}
                onDoubleClick={() => this.props.onMove(index - this.state.currentIndex)}>
                {(snapshotStr || '<EMPTY SNAPSHOT>').substring(0, 1000)}
            </pre>
        );
    };
}
