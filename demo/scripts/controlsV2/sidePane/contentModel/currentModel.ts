import { ContentModelDocument } from 'roosterjs-content-model-types';

let currentModel: ContentModelDocument | null = null;

export function getCurrentContentModel(): ContentModelDocument | null {
    return currentModel;
}

export function setCurrentContentModel(model: ContentModelDocument | null) {
    currentModel = model;
}
