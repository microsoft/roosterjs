import { cloneModel, StandaloneEditor } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import {
    ContentModelDocument,
    IStandaloneEditor,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

export function initEditor(id: string): IStandaloneEditor {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let options: StandaloneEditorOptions = {
        plugins: [new PastePlugin()],
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

    let editor = new StandaloneEditor(node as HTMLDivElement, options);

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
