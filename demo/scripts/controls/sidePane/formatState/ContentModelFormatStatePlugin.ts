import FormatStatePlugin from './FormatStatePlugin';
import { getFormatState, IContentModelEditor } from 'roosterjs-content-model';
import { getPositionRect } from 'roosterjs-editor-dom';

export default class ContentModelFormatStatePlugin extends FormatStatePlugin {
    protected getFormatState() {
        if (!this.editor) {
            return null;
        }

        const format = getFormatState(this.editor as IContentModelEditor);
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
