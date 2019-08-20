import * as React from 'react';
import SidePanePlugin from '../../SidePanePlugin';
import SnapshotPane from './SnapshotPane';
import UndoSnapshots from './UndoSnapshots';
import { createSnapshots } from 'roosterjs-editor-dom';
import { Editor, Undo, UndoSnapshotsService } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType, Snapshots } from 'roosterjs-editor-types';

export default class SnapshotPlugin extends Undo implements SidePanePlugin {
    private editorInstance: Editor;
    private component: SnapshotPane;
    private snapshots: Snapshots;
    private snapshotService: UndoSnapshotsService;

    constructor() {
        super();
        this.snapshots = createSnapshots(1e7);
        this.snapshotService = new UndoSnapshots(this.snapshots);
    }

    initialize(editor: Editor) {
        super.initialize(editor);
        this.editorInstance = editor;
    }

    dispose() {
        this.editorInstance = null;
        super.dispose();
    }

    onPluginEvent(e: PluginEvent) {
        if (e.eventType == PluginEventType.EditorReady) {
            this.updateSnapshots();
        }

        super.onPluginEvent(e);
    }

    getTitle() {
        return 'Undo Snapshots';
    }

    renderSidePane() {
        return <SnapshotPane {...this.getComponentProps()} ref={this.refCallback} />;
    }

    addUndoSnapshot() {
        let snapshot = super.addUndoSnapshot();
        this.updateSnapshots();
        return snapshot;
    }

    undo() {
        super.undo();
        this.updateSnapshots();
    }

    redo() {
        super.redo();
        this.updateSnapshots();
    }

    clear() {
        super.clear();
        this.updateSnapshots();
    }

    protected getSnapshotsManager() {
        return this.snapshotService;
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

    private onTakeSnapshot = () => {
        return this.editorInstance.getContent(false, true);
    };

    private onMove = (step: number) => {
        let sanpshot = this.getSnapshotsManager().move(step);
        this.onRestoreSnapshot(sanpshot);
        this.updateSnapshots();
    };

    private onRestoreSnapshot = (snapshot: string) => {
        this.editorInstance.focus();
        this.editorInstance.setContent(snapshot, false /*triggerContentChangedEvent*/);
    };

    private updateSnapshots() {
        if (!this.component) {
            return;
        }

        this.component.updateSnapshots(this.snapshots.snapshots, this.snapshots.currentIndex);
    }
}
