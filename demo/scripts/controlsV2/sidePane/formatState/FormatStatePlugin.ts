import { FormatStatePane, FormatStatePaneProps, FormatStatePaneState } from './FormatStatePane';
import { getDOMInsertPointRect } from 'roosterjs-content-model-dom';
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
            env: this.editor?.getEnvironment(),
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

    private getFormatState(): FormatStatePaneState {
        if (!this.editor) {
            return null;
        }

        const format = getFormatState(this.editor);
        const selection = this.editor?.getDOMSelection();
        let x = 0;
        let y = 0;

        if (selection?.type == 'range') {
            const node = selection.isReverted
                ? selection.range.startContainer
                : selection.range.endContainer;
            const offset = selection.isReverted
                ? selection.range.startOffset
                : selection.range.endOffset;
            const rect = getDOMInsertPointRect(this.editor.getDocument(), { node, offset });

            if (rect) {
                x = rect.left;
                y = rect.top;
            }
        }

        return { format, x, y };
    }
}
