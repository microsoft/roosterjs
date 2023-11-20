import { cloneModel } from 'roosterjs-content-model-core';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { ContentModelPastePlugin } from '../../../lib/paste/ContentModelPastePlugin';
import {
    ContentModelEditorOptions,
    ContentModelEditor,
    IContentModelEditor,
} from 'roosterjs-content-model-editor';

export function initEditor(id: string): IContentModelEditor {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let options: ContentModelEditorOptions = {
        plugins: [new ContentModelPastePlugin()],
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

    let editor = new ContentModelEditor(node as HTMLDivElement, options);

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
