import * as React from 'react';
import SidePanePlugin from '../../SidePanePlugin';
import SnapshotPane from './SnapshotPane';
import UndoSnapshots from './UndoSnapshots';
import { createSnapshots } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import { GetContentMode, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default class SnapshotPlugin implements SidePanePlugin {
    private editorInstance: Editor;
    private component: SnapshotPane;
    private snapshotService: UndoSnapshots;
    private static snapshots = createSnapshots(1e7);

    constructor() {
        this.snapshotService = new UndoSnapshots(SnapshotPlugin.snapshots, this.updateSnapshots);
    }

    getName() {
        return 'Snapshot';
    }

    initialize(editor: Editor) {
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

    private onTakeSnapshot = () => {
        return this.editorInstance.getContent(GetContentMode.RawHTMLWithSelection);
    };

    private onMove = (step: number) => {
        let sanpshot = this.snapshotService.move(step);
        this.onRestoreSnapshot(sanpshot);
    };

    private onRestoreSnapshot = (snapshot: string) => {
        this.editorInstance.focus();
        this.editorInstance.setContent(snapshot, false /*triggerContentChangedEvent*/);
    };

    private updateSnapshots = () => {
        if (!this.component) {
            return;
        }

        this.component.updateSnapshots(
            this.snapshotService.getSnapshots(),
            this.snapshotService.getCurrentIndex()
        );
    };
}
