import { containerProcessor } from './processors/containerProcessor';
import { ContentModelBlockGroupType } from '../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../publicTypes/enum/BlockType';
import { ContentModelDocument } from '../publicTypes/block/group/ContentModelDocument';
import { FormatContext } from './types/FormatContext';

/**
 * Create Content Model from DOM node
 * @param root Root node of the DOM tree. This node itself will not be included in the Content Model
 * @param range Selection range
 * @returns A Content Model of the given root and selection
 */
export default function createContentModelFromDOM(
    root: Node,
    range: Range | null
): ContentModelDocument {
    const context = createFormatContext(range);
    const model = createEmptyModel(root.ownerDocument!);

    containerProcessor(model, root, context);

    // TODO: Normalize this model to remove empty segment and blocks

    return model;
}

function createEmptyModel(doc: Document): ContentModelDocument {
    return {
        blockGroupType: ContentModelBlockGroupType.Document,
        blockType: ContentModelBlockType.BlockGroup,
        blocks: [],
        document: doc,
    };
}

function createFormatContext(range: Range | null): FormatContext {
    const context: FormatContext = {
        isInSelection: false,
    };

    if (range) {
        context.startContainer = range.startContainer;
        context.startOffset = range.startOffset;
        context.endContainer = range.endContainer;
        context.endOffset = range.endOffset;
        context.isSelectionCollapsed = range.collapsed;
    }

    return context;
}
