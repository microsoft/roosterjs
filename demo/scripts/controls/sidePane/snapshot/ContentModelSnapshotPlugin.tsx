import * as React from 'react';
import ContentModelSnapshotPane from './ContentModelSnapshotPane';
import SidePanePlugin from '../../SidePanePlugin';
import { IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { IStandaloneEditor, Snapshot, Snapshots } from 'roosterjs-content-model-types';

export default class ContentModelSnapshotPlugin implements SidePanePlugin {
    private editorInstance: IEditor & IStandaloneEditor;
    private component: ContentModelSnapshotPane;

    constructor(private snapshots: Snapshots) {
        this.snapshots.onChanged = () => this.updateSnapshots();
    }

    getName() {
        return 'Snapshot';
    }

    initialize(editor: IEditor) {
        this.editorInstance = editor as IEditor & IStandaloneEditor;
    }

    dispose() {
        this.editorInstance = null;
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.EditorReady) {
            this.updateSnapshots();
        }
    }

    getTitle() {
        return 'Undo Snapshots';
    }

    renderSidePane() {
        return <ContentModelSnapshotPane {...this.getComponentProps()} ref={this.refCallback} />;
    }

    getSnapshots() {
        return this.snapshots;
    }

    private refCallback = (ref: ContentModelSnapshotPane) => {
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
        return this.editorInstance.takeSnapshot();
    };

    private onMove = (step: number) => {
        const snapshotsManager = this.editorInstance.getSnapshotsManager();
        const snapshot = snapshotsManager.move(step);
        this.onRestoreSnapshot(snapshot);
    };

    private onRestoreSnapshot = (snapshot: Snapshot) => {
        this.editorInstance.focus();
        this.editorInstance.restoreSnapshot(snapshot);
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
