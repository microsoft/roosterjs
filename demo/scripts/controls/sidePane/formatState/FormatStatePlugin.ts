import FormatStatePane, { FormatStatePaneProps } from './FormatStatePane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { getFormatState } from 'roosterjs-editor-api';
import { getPositionRect } from 'roosterjs-editor-dom';
import { IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

export default class FormatStatePlugin extends SidePanePluginImpl<
    FormatStatePane,
    FormatStatePaneProps
> {
    constructor() {
        super(FormatStatePane, 'format', 'Format State');
    }

    initialize(editor: IEditor) {
        super.initialize(editor);
        this.editor.runAsync(editor => {
            editor.focus();

            this.updateFormatState();
        });
    }

    getComponentProps(base: SidePaneElementProps) {
        return {
            ...base,
            ...this.getFormatState(),
        };
    }

    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.KeyUp ||
            event.eventType == PluginEventType.MouseUp ||
            event.eventType == PluginEventType.ContentChanged
        ) {
            this.updateFormatState();
        }
    }

    updateFormatState() {
        this.getComponent(component => component.setFormatState(this.getFormatState()));
    }

    protected getFormatState() {
        if (!this.editor) {
            return null;
        }

        const format = getFormatState(this.editor);
        const position = this.editor && this.editor.getFocusedPosition();
        const rect = position && getPositionRect(position);
        return {
            format,
            inIME: this.editor && this.editor.isInIME(),
            x: rect ? rect.left : 0,
            y: rect ? rect.top : 0,
        };
    }
}
