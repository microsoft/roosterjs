import type { IEditor, DOMSelection } from 'roosterjs-content-model-types';

export function adjustImageSelectionOnSafari(editor: IEditor, selection: DOMSelection | null) {
    if (editor.getEnvironment().isSafari && selection?.type == 'image') {
        const range = new Range();
        range.setStartBefore(selection.image);
        range.setEndAfter(selection.image);
        editor.setDOMSelection({
            range,
            type: 'range',
            isReverted: false,
        });
    }
}
