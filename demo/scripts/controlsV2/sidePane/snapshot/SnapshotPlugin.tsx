import * as React from 'react';
import { IStandaloneEditor, PluginEvent, Snapshot, Snapshots } from 'roosterjs-content-model-types';
import { SidePanePlugin } from '../SidePanePlugin';
import { SnapshotPane } from './SnapshotPane';

export class SnapshotPlugin implements SidePanePlugin {
    private editor: IStandaloneEditor;
    private component: SnapshotPane;

    constructor(private snapshots: Snapshots) {
        this.snapshots.onChanged = () => this.updateSnapshots();
    }

    getName() {
        return 'Snapshot';
    }

    initialize(editor: IStandaloneEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == 'editorReady') {
            this.updateSnapshots();
        }
    }

    getTitle() {
        return 'Undo Snapshots';
    }

    renderSidePane() {
        return <SnapshotPane {...this.getComponentProps()} ref={this.refCallback} />;
    }

    getSnapshots() {
        return this.snapshots;
    }

    private refCallback = (ref: SnapshotPane) => {
        this.component = ref;
        if (ref) {
            this.updateSnapshots();
        }
    };

    private getComponentProps() {
        return {
            onRestoreSnapshot: this.onRestoreSnapshot,
            onTakeSnapshot: this.onTakeSnapshot,
            onMove: this.onMove,
        };
    }

    private onTakeSnapshot = (): Snapshot => {
        return this.editor.takeSnapshot();
    };

    private onMove = (step: number) => {
        const snapshotsManager = this.editor.getSnapshotsManager();
        const snapshot = snapshotsManager.move(step);
        this.onRestoreSnapshot(snapshot);
    };

    private onRestoreSnapshot = (snapshot: Snapshot) => {
        this.editor.focus();
        this.editor.restoreSnapshot(snapshot);
    };

    private updateSnapshots = () => {
        if (!this.component) {
            return;
        }

        this.component.updateSnapshots(
            this.snapshots.snapshots,
            this.snapshots.currentIndex,
            this.snapshots.autoCompleteIndex
        );
    };
}
