import EditorCore, { GetContentTraverser } from '../editor/EditorCore';
import { ContentScope, ContentPosition, TraversingScoper } from 'roosterjs-editor-types';
import {
    ContentTraverser,
    SelectionBlockScoper,
    SelectionScoper,
    BodyScoper,
} from 'roosterjs-editor-dom';

const getContentTraverser: GetContentTraverser = (
    core: EditorCore,
    scope: ContentScope,
    position: ContentPosition = ContentPosition.SelectionStart
) => {
    let selectionRange = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
    if (scope != ContentScope.Body && !selectionRange) {
        return null;
    }

    let contentTraverser: ContentTraverser;
    let scoper: TraversingScoper;
    switch (scope) {
        case ContentScope.Block:
            scoper = new SelectionBlockScoper(
                core.contentDiv,
                selectionRange,
                position,
                core.inlineElementFactory
            );
            break;
        case ContentScope.Selection:
            scoper = new SelectionScoper(
                core.contentDiv,
                selectionRange,
                core.inlineElementFactory
            );
            break;
        case ContentScope.Body:
            scoper = new BodyScoper(core.contentDiv, core.inlineElementFactory);
            break;
    }

    if (scoper) {
        contentTraverser = new ContentTraverser(core.contentDiv, scoper, core.inlineElementFactory);
    }

    return contentTraverser;
};

export default getContentTraverser;
