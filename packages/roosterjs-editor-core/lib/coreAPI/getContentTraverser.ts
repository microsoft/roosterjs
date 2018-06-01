import EditorCore, { GetContentTraverser } from '../editor/EditorCore';
import { ContentScope, ContentPosition } from 'roosterjs-editor-types';
import { ContentTraverser } from 'roosterjs-editor-dom';

const getContentTraverser: GetContentTraverser = (
    core: EditorCore,
    scope: ContentScope,
    position: ContentPosition = ContentPosition.SelectionStart
) => {
    let range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

    switch (scope) {
        case ContentScope.Block:
            return (
                range &&
                ContentTraverser.createSelectionBlockTraverser(core.contentDiv, range, position)
            );
        case ContentScope.Selection:
            return range && ContentTraverser.createSelectionTraverser(core.contentDiv, range);
        case ContentScope.Body:
            return ContentTraverser.createBodyTraverser(core.contentDiv);
    }

    return null;
};

export default getContentTraverser;
