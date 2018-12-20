import * as React from 'react';

const styles = require('./SnapshotPane.scss');

export interface SnapshotPaneProps {
    onTakeSnapshot: () => string;
    onRestoreSnapshot: (snapshot: string) => void;
}

export default class SnapshotPane extends React.Component<SnapshotPaneProps, {}> {
    private textarea: HTMLTextAreaElement;

    render() {
        return (
            <div className={styles.snapshotPane}>
                <div className={styles.buttons}>
                    <button onClick={this.takeSnapshot}>{'Take snapshot'}</button>{' '}
                    <button onClick={this.restoreSnapshot}>{'Restore snapshot'}</button>
                </div>
                <textarea ref={ref => (this.textarea = ref)} className={styles.textarea} spellCheck={false} />
            </div>
        );
    }

    private takeSnapshot = () => {
        let snapshot = this.props.onTakeSnapshot();
        this.textarea.value = snapshot;
    };

    private restoreSnapshot = () => {
        let snapshot = this.textarea.value;
        this.props.onRestoreSnapshot(snapshot);
    };
}
