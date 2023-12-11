import * as React from 'react';
import ContentModelSnapshotPane from './ContentModelSnapshotPane';
import SidePanePlugin from '../../SidePanePlugin';
import { createSnapshotsManager } from 'roosterjs-content-model-core/lib/editor/SnapshotsManagerImpl';
import { IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    IStandaloneEditor,
    Snapshot,
    Snapshots,
    SnapshotsManager,
} from 'roosterjs-content-model-types';

class SnapshotsManagerProxy implements SnapshotsManager {
    private innerManager: SnapshotsManager;
    private hijackUndoSnapshotCallback: undefined | ((snapshot: Snapshot) => void);

    constructor(snapshots: Snapshots, private onChange: () => void) {
        this.innerManager = createSnapshotsManager(snapshots);
    }

    get hasNewContent() {
        return this.innerManager.hasNewContent;
    }

    set hasNewContent(value: boolean) {
        this.innerManager.hasNewContent = value;
    }

    public startHijackUndoSnapshot(callback: (snapshot: Snapshot) => void) {
        this.hijackUndoSnapshotCallback = callback;
    }

    public stopHijackUndoSnapshot() {
        this.hijackUndoSnapshotCallback = undefined;
    }

    public canMove(delta: number): boolean {
        return this.innerManager.canMove(delta);
    }

    public move(delta: number): Snapshot {
        const result = this.innerManager.move(delta);
        this.onChange();
        return result;
    }

    public addSnapshot(snapshot: Snapshot, isAutoCompleteSnapshot: boolean) {
        if (this.hijackUndoSnapshotCallback) {
            this.hijackUndoSnapshotCallback(snapshot);
        } else {
            this.innerManager.addSnapshot(snapshot, isAutoCompleteSnapshot);
            this.onChange();
        }
    }

    public clearRedo() {
        this.innerManager.clearRedo();
        this.onChange();
    }

    public canUndoAutoComplete() {
        return this.innerManager.canUndoAutoComplete();
    }
}

export default class ContentModelSnapshotPlugin implements SidePanePlugin {
    private editorInstance: IEditor & IStandaloneEditor;
    private component: ContentModelSnapshotPane;
    private snapshotManager: SnapshotsManagerProxy;

    constructor(private snapshots: Snapshots) {
        this.snapshotManager = new SnapshotsManagerProxy(snapshots, this.updateSnapshots);
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

    getSnapshotsManager() {
        return this.snapshotManager;
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
        let newSnapshot: Snapshot;

        try {
            this.snapshotManager.startHijackUndoSnapshot(snapshot => {
                newSnapshot = snapshot;
            });
            this.editorInstance.addUndoSnapshot();
        } finally {
            this.snapshotManager.stopHijackUndoSnapshot();
        }

        return newSnapshot;
    };

    private onMove = (step: number) => {
        const snapshot = this.snapshotManager.move(step);
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
