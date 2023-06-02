import * as React from 'react';
import SidePanePlugin from '../../SidePanePlugin';
import SnapshotPane from './SnapshotPane';
import UndoSnapshots from './UndoSnapshots';
import { ChangeSource, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { createSnapshots } from 'roosterjs-editor-dom';
import { Snapshot } from 'roosterjs-editor-types';

export default class SnapshotPlugin implements SidePanePlugin {
    private editorInstance: IEditor;
    private component: SnapshotPane;
    private snapshotService: UndoSnapshots;
    private static snapshots = createSnapshots<Snapshot>(1e7);

    constructor() {
        this.snapshotService = new UndoSnapshots(SnapshotPlugin.snapshots, this.updateSnapshots);
    }

    getName() {
        return 'Snapshot';
    }

    initialize(editor: IEditor) {
        this.editorInstance = editor;
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
        return <SnapshotPane {...this.getComponentProps()} ref={this.refCallback} />;
    }

    getSnapshotService() {
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

    private onTakeSnapshot = (): Snapshot => {
        let newSnapshot: Snapshot;

        try {
            this.snapshotService.startHijackUndoSnapshot(snapshot => {
                newSnapshot = snapshot;
            });
            this.editorInstance.addUndoSnapshot();
        } finally {
            this.snapshotService.stopHijackUndoSnapshot();
        }

        return newSnapshot;
    };

    private onMove = (step: number) => {
        const snapshot = this.snapshotService.move(step);
        this.onRestoreSnapshot(snapshot);
    };

    private onRestoreSnapshot = (snapshot: Snapshot) => {
        this.editorInstance.focus();
        this.editorInstance.setContent(
            this.component.snapshotToString(snapshot),
            false /*triggerContentChangedEvent*/
        );
        this.editorInstance.triggerContentChangedEvent(ChangeSource.SetContent);
    };

    private updateSnapshots = () => {
        if (!this.component) {
            return;
        }

        this.component.updateSnapshots(
            this.snapshotService.getSnapshots(),
            this.snapshotService.getCurrentIndex(),
            this.snapshotService.getAutoCompleteIndex()
        );
    };
}
