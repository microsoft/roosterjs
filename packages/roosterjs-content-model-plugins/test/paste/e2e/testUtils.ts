import { cloneModel } from 'roosterjs-content-model-dom';
import { ContentModelDocument, EditorOptions, IEditor } from 'roosterjs-content-model-types';
import { Editor } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';

export function initEditor(id: string): IEditor {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let options: EditorOptions = {
        plugins: [new PastePlugin()],
        disableCache: true,
        coreApiOverride: {
            getVisibleViewport: () => {
                return {
                    top: 100,
                    bottom: 200,
                    left: 100,
                    right: 200,
                };
            },
        },
    };

    let editor = new Editor(node as HTMLDivElement, options);

    return editor;
}

export function expectEqual(model1: ContentModelDocument, model2: ContentModelDocument) {
    /// Remove Cached elements and undefined properties
    const newModel = JSON.parse(
        JSON.stringify(
            cloneModel(model1, {
                includeCachedElement: false,
            })
        )
    );

    expect(newModel).toEqual(model2);
}
