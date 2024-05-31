import {
    addSegment,
    addTextSegment,
    buildSelectionMarker,
    getRegularSelectionOffsets,
    mutateBlock,
    processChildNode,
} from 'roosterjs-content-model-dom';
import type {
    ElementProcessor,
    DOMInsertPoint,
    FormatContentModelOptions,
    IEditor,
    InsertPoint,
    DomToModelContext,
    ContentModelBlockGroup,
    FormatContentModelContext,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * Format content model at a given insert point with a callback function
 * @param editor The editor object
 * @param insertPoint The insert point to format
 * @param callback The callback function to format the content model
 * @param options Options to control the behavior of the formatting
 */
export function formatInsertPointWithContentModel(
    editor: IEditor,
    insertPoint: DOMInsertPoint,
    callback: (
        model: ShallowMutableContentModelDocument,
        context: FormatContentModelContext,
        insertPoint?: InsertPoint
    ) => void,
    options?: FormatContentModelOptions
) {
    const bundle: InsertPointBundle = {
        input: insertPoint,
    };

    editor.formatContentModel(
        (model, context) => {
            callback(model, context, bundle.result);

            if (bundle?.result) {
                const { paragraph, marker } = bundle.result;
                const index = paragraph.segments.indexOf(marker);

                if (index >= 0) {
                    mutateBlock(paragraph).segments.splice(index, 1);
                }
            }
            return true;
        },
        options,
        {
            processorOverride: {
                child: getShadowChildProcessor(bundle),
                textWithSelection: getShadowTextProcessor(bundle),
            },
            tryGetFromCache: false,
        }
    );
}

interface InsertPointBundle {
    input: DOMInsertPoint;
    result?: InsertPoint;
}

interface DomToModelContextWithPath extends DomToModelContext {
    /**
     * Block group path of this insert point, from direct parent group to the root group
     */
    path?: ContentModelBlockGroup[];
}

function getShadowChildProcessor(bundle: InsertPointBundle): ElementProcessor<ParentNode> {
    return (group, parent, context) => {
        const contextWithPath = context as DomToModelContextWithPath;

        contextWithPath.path = contextWithPath.path || [];

        let shouldShiftPath = false;
        if (contextWithPath.path[0] != group) {
            contextWithPath.path.unshift(group);
            shouldShiftPath = true;
        }

        const offsets = getShadowSelectionOffsets(context, bundle, parent);
        let index = 0;

        for (let child = parent.firstChild; child; child = child.nextSibling) {
            handleElementShadowSelection(bundle, index, context, group, offsets, parent);

            processChildNode(group, child, context);

            index++;
        }

        handleElementShadowSelection(bundle, index, context, group, offsets, parent);

        if (shouldShiftPath) {
            contextWithPath.path.shift();
        }
    };
}

function handleElementShadowSelection(
    bundle: InsertPointBundle,
    index: number,
    context: DomToModelContext,
    group: ContentModelBlockGroup,
    offsets: [number, number, number],
    container?: Node
) {
    if (
        index == offsets[2] &&
        (index <= offsets[0] || offsets[0] < 0) &&
        (index < offsets[1] || offsets[1] < 0)
    ) {
        addSelectionMarker(group, context, container, index, bundle);
        offsets[2] = -1;
    }

    if (index == offsets[0]) {
        context.isInSelection = true;
        addSelectionMarker(group, context, container, index);
    }

    if (index == offsets[2] && (index < offsets[1] || offsets[1] < 0)) {
        addSelectionMarker(group, context, container, index, bundle);
        offsets[2] = -1;
    }

    if (index == offsets[1]) {
        addSelectionMarker(group, context, container, index);
        context.isInSelection = false;
    }

    if (index == offsets[2]) {
        addSelectionMarker(group, context, container, index, bundle);
    }
}

const getShadowTextProcessor = (bundle: InsertPointBundle): ElementProcessor<Text> => (
    group,
    textNode,
    context
) => {
    let txt = textNode.nodeValue || '';
    const offsets = getShadowSelectionOffsets(context, bundle, textNode);
    const [start, end, shadow] = offsets;

    const handleTextSelection = (
        subtract: number,
        originalOffset: number,
        bundle?: InsertPointBundle
    ) => {
        addTextSegment(group, txt.substring(0, subtract), context);
        addSelectionMarker(group, context, textNode, originalOffset, bundle);

        offsets[0] -= subtract;
        offsets[1] -= subtract;
        offsets[2] = bundle ? -1 : offsets[2] - subtract;

        txt = txt.substring(subtract);
    };

    if (
        offsets[2] >= 0 &&
        (offsets[2] <= offsets[0] || offsets[0] < 0) &&
        (offsets[2] < offsets[1] || offsets[1] < 0)
    ) {
        handleTextSelection(offsets[2], shadow, bundle);
    }

    if (offsets[0] >= 0) {
        handleTextSelection(offsets[0], start);

        context.isInSelection = true;
    }

    if (offsets[2] >= 0 && offsets[2] > offsets[0] && (offsets[2] < offsets[1] || offsets[1] < 0)) {
        handleTextSelection(offsets[2], shadow, bundle);
    }

    if (offsets[1] >= 0) {
        handleTextSelection(offsets[1], end);

        context.isInSelection = false;
    }

    if (offsets[2] >= 0 && offsets[2] >= offsets[1]) {
        handleTextSelection(offsets[2], shadow, bundle);
    }

    addTextSegment(group, txt, context);
};

function addSelectionMarker(
    group: ContentModelBlockGroup,
    context: DomToModelContextWithPath,
    container?: Node,
    offset?: number,
    bundle?: InsertPointBundle
) {
    const marker = buildSelectionMarker(group, context, container, offset);

    marker.isSelected = !bundle;

    const para = addSegment(group, marker, context.blockFormat, marker.format);

    if (bundle && context.path) {
        bundle.result = {
            path: [...context.path],
            paragraph: para,
            marker,
        };
    }
}

function getShadowSelectionOffsets(
    context: DomToModelContext,
    bundle: InsertPointBundle,
    currentContainer: Node
): [number, number, number] {
    const [start, end] = getRegularSelectionOffsets(context, currentContainer);
    const shadow = bundle.input.node == currentContainer ? bundle.input.offset : -1;

    return [start, end, shadow];
}
