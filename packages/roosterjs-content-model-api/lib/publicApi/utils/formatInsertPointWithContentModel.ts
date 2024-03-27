import {
    addSegment,
    addTextSegment,
    buildSelectionMarker,
    getRegularSelectionOffsets,
    handleRegularSelection,
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
    ContentModelDocument,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

/**
 * @internal Export for test only
 */
export interface InsertPointBundle {
    input: DOMInsertPoint;
    result?: InsertPoint;
}

/**
 * @internal
 */
export function formatInsertPointWithContentModel(
    editor: IEditor,
    apiName: string,
    insertPoint: DOMInsertPoint,
    callback: (
        model: ContentModelDocument,
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
                    paragraph.segments.splice(index, 1);
                }
            }
            return true;
        },
        { ...options, apiName },
        {
            processorOverride: {
                child: getShadowChildProcessor(bundle),
                '#text': getShadowTextProcessor(bundle),
            },
        }
    );
}

/**
 * @internal
 */
export interface DomToModelContextWithPath extends DomToModelContext {
    /**
     * Block group path of this insert point, from direct parent group to the root group
     */
    path?: ContentModelBlockGroup[];
}

const getShadowChildProcessor = (bundle: InsertPointBundle): ElementProcessor<ParentNode> => {
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
};

function handleElementShadowSelection(
    bundle: InsertPointBundle,
    index: number,
    context: DomToModelContext,
    group: ContentModelBlockGroup,
    offsets: [number, number, number],
    container?: Node
) {
    handleRegularSelection(index, context, group, offsets[0], offsets[1], container);

    if (index == offsets[2]) {
        addSelectionMarker(group, context, bundle, container, index, true /*isShadowMarker*/);
    }
}

/**
 * @internal export for test only
 */
export const getShadowTextProcessor = (bundle: InsertPointBundle): ElementProcessor<Text> => (
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
        isShadowMarker?: boolean
    ) => {
        addTextSegment(group, txt.substring(0, subtract), context);
        addSelectionMarker(group, context, bundle, textNode, originalOffset, isShadowMarker);

        offsets[0] -= subtract;
        offsets[1] -= subtract;
        offsets[2] = isShadowMarker ? -1 : offsets[2] - subtract;

        txt = txt.substring(subtract);
    };

    if (
        offsets[2] >= 0 &&
        (offsets[2] <= offsets[0] || offsets[0] < 0) &&
        (offsets[2] < offsets[1] || offsets[1] < 0)
    ) {
        handleTextSelection(offsets[2], shadow, true /*isShadowMarker*/);
    }

    if (offsets[0] >= 0) {
        handleTextSelection(offsets[0], start);

        context.isInSelection = true;
    }

    if (offsets[2] >= 0 && offsets[2] > offsets[0] && (offsets[2] < offsets[1] || offsets[1] < 0)) {
        handleTextSelection(offsets[2], shadow, true /*isShadowMarker*/);
    }

    if (offsets[1] >= 0) {
        handleTextSelection(offsets[1], end);

        context.isInSelection = false;
    }

    if (offsets[2] >= 0 && offsets[2] >= offsets[1]) {
        handleTextSelection(offsets[2], shadow, true /*isShadowMarker*/);
    }

    addTextSegment(group, txt, context);
};

function addSelectionMarker(
    group: ContentModelBlockGroup,
    context: DomToModelContextWithPath,
    bundle: InsertPointBundle,
    container?: Node,
    offset?: number,
    isShadowMarker?: boolean
) {
    const marker = buildSelectionMarker(group, context, container, offset);

    marker.isSelected = !isShadowMarker;

    const para = addSegment(group, marker, context.blockFormat, marker.format);

    if (isShadowMarker && context.path) {
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
