import { ContentModelDocument } from 'roosterjs-content-model';
import { IEditor } from 'roosterjs-editor-types';

const CurrentContentModelHolderKey = '_CurrentContentModelHolder';

interface CurrentContentModelHolder {
    model: ContentModelDocument | null;
}

function getCurrentModelHolder(editor: IEditor) {
    return editor.getCustomData(
        CurrentContentModelHolderKey,
        () => <CurrentContentModelHolder>{ model: null }
    );
}

export function getCurrentContentModel(editor: IEditor): ContentModelDocument | null {
    return getCurrentModelHolder(editor).model;
}

export function setCurrentContentModel(editor: IEditor, model: ContentModelDocument | null) {
    getCurrentModelHolder(editor).model = model;
}
