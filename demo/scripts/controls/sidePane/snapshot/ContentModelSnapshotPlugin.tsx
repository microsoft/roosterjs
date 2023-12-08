import * as React from 'react';
import ContentModelSnapshotPane from './ContentModelSnapshotPane';
import SidePanePlugin from '../../SidePanePlugin';
import { createUndoSnapshotService } from 'roosterjs-content-model-core/lib/editor/UndoSnapshotServiceImpl';
import { IStandaloneEditor, Snapshot } from 'roosterjs-content-model-types';
import {
    IEditor,
    PluginEvent,
    PluginEventType,
    Snapshots,
    UndoSnapshotsService,
} from 'roosterjs-editor-types';

class UndoSnapshotsServiceProxy implements UndoSnapshotsService<Snapshot> {
    private innerService: UndoSnapshotsService<Snapshot>;
    private hijackUndoSnapshotCallback: undefined | ((snapshot: Snapshot) => void);

    constructor(snapshots: Snapshots<Snapshot>, private onChange: () => void) {
        this.innerService = createUndoSnapshotService(snapshots);
    }

    public startHijackUndoSnapshot(callback: (snapshot: Snapshot) => void) {
        this.hijackUndoSnapshotCallback = callback;
    }

    public stopHijackUndoSnapshot() {
        this.hijackUndoSnapshotCallback = undefined;
    }

    public canMove(delta: number): boolean {
        return this.innerService.canMove(delta);
    }

    public move(delta: number): Snapshot {
        const result = this.innerService.move(delta);
        this.onChange();
        return result;
    }

    public addSnapshot(snapshot: Snapshot, isAutoCompleteSnapshot: boolean) {
        if (this.hijackUndoSnapshotCallback) {
            this.hijackUndoSnapshotCallback(snapshot);
        } else {
            this.innerService.addSnapshot(snapshot, isAutoCompleteSnapshot);
            this.onChange();
        }
    }

    public clearRedo() {
        this.innerService.clearRedo();
        this.onChange();
    }

    public canUndoAutoComplete() {
        return this.innerService.canUndoAutoComplete();
    }
}

export default class ContentModelSnapshotPlugin implements SidePanePlugin {
    private editorInstance: IEditor & IStandaloneEditor;
    private component: ContentModelSnapshotPane;
    private undoService: UndoSnapshotsServiceProxy;

    constructor(private snapshots: Snapshots<Snapshot>) {
        this.undoService = new UndoSnapshotsServiceProxy(snapshots, this.updateSnapshots);
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

    getSnapshotService() {
        return this.undoService;
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
            this.undoService.startHijackUndoSnapshot(snapshot => {
                newSnapshot = snapshot;
            });
            this.editorInstance.addUndoSnapshot();
        } finally {
            this.undoService.stopHijackUndoSnapshot();
        }

        return newSnapshot;
    };

    private onMove = (step: number) => {
        const snapshot = this.undoService.move(step);
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
