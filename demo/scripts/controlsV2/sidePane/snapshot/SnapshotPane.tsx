import * as React from 'react';
import { EntityState, Snapshot, SnapshotSelection } from 'roosterjs-content-model-types';

const styles = require('./SnapshotPane.scss');

export interface SnapshotPaneProps {
    onTakeSnapshot: () => Snapshot;
    onRestoreSnapshot: (snapshot: Snapshot, triggerContentChangedEvent: boolean) => void;
    onMove: (moveStep: number) => void;
}

export interface SnapshotPaneState {
    snapshots: Snapshot[];
    currentIndex: number;
    autoCompleteIndex: number;
}

export class SnapshotPane extends React.Component<SnapshotPaneProps, SnapshotPaneState> {
    private html = React.createRef<HTMLTextAreaElement>();
    private entityStates = React.createRef<HTMLTextAreaElement>();
    private isDarkColor = React.createRef<HTMLInputElement>();
    private selection = React.createRef<HTMLTextAreaElement>();

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
            <div className={styles.snapshotPane} onPaste={this.onPaste}>
                <h3>Undo Snapshots</h3>
                <div className={styles.snapshotList}>
                    {this.state.snapshots.map(this.renderItem)}
                </div>
                <h3>Selected Snapshot</h3>
                <div className={styles.buttons}>
                    <button onClick={this.takeSnapshot}>{'Take snapshot'}</button>{' '}
                    <button onClick={this.onClickRestoreSnapshot}>{'Restore snapshot'}</button>
                    <button onClick={this.onCopy}>{'Copy snapshot with metadata'}</button>
                </div>
                <div>HTML:</div>
                <textarea ref={this.html} className={styles.textarea} spellCheck={false} />
                <div>Selection:</div>
                <textarea ref={this.selection} className={styles.textarea} spellCheck={false} />
                <div>Entity states:</div>
                <textarea ref={this.entityStates} className={styles.textarea} spellCheck={false} />
                <div>
                    <input type="checkbox" ref={this.isDarkColor} id="isUndoInDarkColor" />
                    <label htmlFor="isUndoInDarkColor">Is in dark mode</label>
                </div>
            </div>
        );
    }

    private getCurrentSnapshot(): Snapshot {
        const html = this.html.current.value;
        const selection = this.selection.current.value
            ? (JSON.parse(this.selection.current.value) as SnapshotSelection)
            : undefined;
        const entityStates = this.entityStates.current.value
            ? (JSON.parse(this.entityStates.current.value) as EntityState[])
            : undefined;
        const isDarkMode = !!this.isDarkColor.current.checked;

        return {
            html,
            entityStates,
            isDarkMode,
            selection,
        };
    }

    private onClickRestoreSnapshot = () => {
        const snapshot = this.getCurrentSnapshot();

        this.props.onRestoreSnapshot(snapshot, true);
    };

    private onCopy = () => {
        const snapshot = this.getCurrentSnapshot();
        const metadata = {
            ...snapshot.selection,
            isDarkMode: snapshot.isDarkMode,
        };
        const textToCopy = snapshot.html + `<!--${JSON.stringify(metadata)}-->`;

        navigator.clipboard.writeText(textToCopy);
    };

    private onPaste = (event: React.ClipboardEvent) => {
        const str = event.clipboardData.getData('text/plain');

        if (str) {
            const idx = str.lastIndexOf('<!--');

            if (idx >= 0 && str.endsWith('-->')) {
                const html = str.substring(0, idx);
                const json = str.substring(idx + 4, str.length - 3);

                try {
                    const metadata = JSON.parse(json);
                    const isDarkMode = !!metadata.isDarkMode;

                    delete metadata.isDarkMode;

                    this.setSnapshot({
                        html: html,
                        entityStates: [],
                        isDarkMode: isDarkMode,
                        selection: metadata as SnapshotSelection,
                    });

                    event.preventDefault();
                } catch {}
            }
        }
    };

    updateSnapshots(snapshots: Snapshot[], currentIndex: number, autoCompleteIndex: number) {
        this.setState({
            snapshots,
            currentIndex,
            autoCompleteIndex,
        });
    }

    snapshotToString(snapshot: Snapshot) {
        return (
            snapshot.html +
            (snapshot.selection ? `<!--${JSON.stringify(snapshot.selection)}-->` : '')
        );
    }

    private takeSnapshot = () => {
        const snapshot = this.props.onTakeSnapshot();
        this.setSnapshot(snapshot);
    };

    private setSnapshot = (snapshot: Snapshot) => {
        this.html.current.value = snapshot.html;
        this.entityStates.current.value = snapshot.entityStates
            ? JSON.stringify(snapshot.entityStates)
            : '';
        this.selection.current.value = snapshot.selection ? JSON.stringify(snapshot.selection) : '';
        this.isDarkColor.current.checked = !!snapshot.isDarkMode;
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
                onClick={() => this.setSnapshot(snapshot)}
                onDoubleClick={() => this.props.onMove(index - this.state.currentIndex)}>
                {(snapshotStr || '<EMPTY SNAPSHOT>').substring(0, 1000)}
            </pre>
        );
    };
}
