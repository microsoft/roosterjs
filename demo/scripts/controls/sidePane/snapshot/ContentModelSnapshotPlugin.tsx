import * as React from 'react';
import ContentModelSnapshotPane from './ContentModelSnapshotPane';
import SidePanePlugin from '../../SidePanePlugin';
import { createUndoSnapshotService } from 'roosterjs-content-model-core';
import { IStandaloneEditor, UndoSnapshot } from 'roosterjs-content-model-types';
import {
    IEditor,
    PluginEvent,
    PluginEventType,
    Snapshots,
    UndoSnapshotsService,
} from 'roosterjs-editor-types';

class ContentModelUndoSnapshotServiceProxy implements UndoSnapshotsService<UndoSnapshot> {
    private innerService: UndoSnapshotsService<UndoSnapshot>;

    constructor(private snapshots: Snapshots<UndoSnapshot>, private onChange: () => void) {
        this.innerService = createUndoSnapshotService(snapshots);
    }

    canMove(step: number): boolean {
        return this.innerService.canMove(step);
    }

    move(step: number): UndoSnapshot {
        const result = this.innerService.move(step);
        this.onChange();
        return result;
    }

    addSnapshot(snapshot: UndoSnapshot, isAutoCompleteSnapshot: boolean): void {
        this.innerService.addSnapshot(snapshot, isAutoCompleteSnapshot);
        this.onChange();
    }

    clearRedo(): void {
        this.innerService.clearRedo();
        this.onChange();
    }

    canUndoAutoComplete(): boolean {
        return this.innerService.canUndoAutoComplete();
    }

    getSnapshots() {
        return this.snapshots.snapshots;
    }

    getCurrentIndex() {
        return this.snapshots.currentIndex;
    }

    getAutoCompleteIndex() {
        return this.snapshots.autoCompleteIndex;
    }
}

export default class ContentModelSnapshotPlugin implements SidePanePlugin {
    private editorInstance: IEditor & IStandaloneEditor;
    private component: ContentModelSnapshotPane;
    private outerService: ContentModelUndoSnapshotServiceProxy;

    constructor(snapshots: Snapshots<UndoSnapshot>) {
        this.outerService = new ContentModelUndoSnapshotServiceProxy(
            snapshots,
            this.updateSnapshots
        );
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
        return this.outerService;
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

    private onTakeSnapshot = (): UndoSnapshot => {
        return this.editorInstance.takeSnapshot();
    };

    private onMove = (step: number) => {
        const snapshot = this.outerService.move(step);
        this.onRestoreSnapshot(snapshot);
    };

    private onRestoreSnapshot = (snapshot: UndoSnapshot) => {
        this.editorInstance.focus();
        this.editorInstance.restoreSnapshot(snapshot);
    };

    private updateSnapshots = () => {
        if (!this.component) {
            return;
        }

        this.component.updateSnapshots(
            this.outerService.getSnapshots(),
            this.outerService.getCurrentIndex(),
            this.outerService.getAutoCompleteIndex()
        );
    };
}
