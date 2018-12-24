import * as React from 'react';

const styles = require('./SnapshotPane.scss');

export interface SnapshotPaneProps {
    onTakeSnapshot: () => string;
    onRestoreSnapshot: (snapshot: string) => void;
    onMove: (moveStep: number) => void;
}

export interface SnapshotPaneState {
    snapshots: string[];
    currentIndex: number;
}

export default class SnapshotPane extends React.Component<SnapshotPaneProps, SnapshotPaneState> {
    private textarea: HTMLTextAreaElement;

    constructor(props: SnapshotPaneProps) {
        super(props);

        this.state = {
            snapshots: [],
            currentIndex: -1,
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
                    <button onClick={() => this.props.onRestoreSnapshot(this.textarea.value)}>
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

    updateSnapshots(snapshots: string[], currentIndex: number) {
        this.setState({
            snapshots,
            currentIndex,
        });
    }

    private takeSnapshot = () => {
        this.setSnapshot(this.props.onTakeSnapshot());
    };

    private setSnapshot = (snapshot: string) => {
        this.textarea.value = snapshot;
    };

    private renderItem = (snapshot: string, index: number) => {
        return (
            <pre
                className={index == this.state.currentIndex ? styles.current : ''}
                key={index}
                onClick={() => this.setSnapshot(snapshot)}
                onDoubleClick={() => this.props.onMove(index - this.state.currentIndex)}
            >
                {snapshot || '<EMPTY SNAPSHOT>'}
            </pre>
        );
    };
}
