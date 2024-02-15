import FormatStatePlugin from './FormatStatePlugin';
import { FormatState, IEditor } from 'roosterjs-editor-types';
import { getFormatState } from 'roosterjs-content-model-api';
import { getPositionRect } from 'roosterjs-editor-dom';
import { IStandaloneEditor } from 'roosterjs-content-model-types';

export default class ContentModelFormatStatePlugin extends FormatStatePlugin {
    protected getFormatState() {
        if (!this.editor) {
            return null;
        }

        const format = (getFormatState(
            this.editor as IStandaloneEditor & IEditor
        ) as any) as FormatState;
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
