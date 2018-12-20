import FormatStatePane, { FormatStatePaneState } from './FormatStatePane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { Editor } from 'roosterjs-editor-core';
import { getFormatState } from 'roosterjs-editor-api';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default class FormatStatePlugin extends SidePanePluginImpl<
    FormatStatePane,
    FormatStatePaneState
> {
    name: 'FormatState';

    constructor() {
        super(FormatStatePane, 'Format State');
    }

    initialize(editor: Editor) {
        super.initialize(editor);
        this.editor.runAsync(() => {
            this.editor.focus();

            this.updateForamtState();
        });
    }

    getComponentProps() {
        return this.getFormatState();
    }

    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.KeyUp ||
            event.eventType == PluginEventType.MouseUp ||
            event.eventType == PluginEventType.ContentChanged
        ) {
            this.updateForamtState();
        }
    }

    updateForamtState() {
        this.getComponent(component => component.setFormatState(this.getFormatState()));
    }

    private getFormatState(): FormatStatePaneState {
        let format = this.editor && getFormatState(this.editor);
        let rect = this.editor && this.editor.getCursorRect();
        return {
            format,
            x: rect ? rect.left : 0,
            y: rect ? rect.top : 0,
        };
    }
}
