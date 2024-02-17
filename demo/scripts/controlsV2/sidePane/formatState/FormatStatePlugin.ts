import FormatStatePane, { FormatStatePaneProps } from './FormatStatePane';
import { getFormatState } from 'roosterjs-content-model-api';
import { PluginEvent } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export class FormatStatePlugin extends SidePanePluginImpl<FormatStatePane, FormatStatePaneProps> {
    constructor() {
        super(FormatStatePane, 'format', 'Format State');
    }

    getComponentProps(base: SidePaneElementProps) {
        return {
            ...base,
            ...this.getFormatState(),
        };
    }

    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case 'editorReady':
            case 'keyUp':
            case 'mouseUp':
            case 'contentChanged':
                this.updateFormatState();
                break;
        }
    }

    updateFormatState() {
        this.getComponent(component => component.setFormatState(this.getFormatState()));
    }

    private getFormatState() {
        if (!this.editor) {
            return null;
        }

        const format = getFormatState(this.editor);
        // const position = this.editor && this.editor.getFocusedPosition();
        // const rect = position && getPositionRect(position);

        return {
            format,
            // inIME: this.editor && this.editor.isInIME(),
            // x: rect ? rect.left : 0,
            // y: rect ? rect.top : 0,
        };
    }
}
