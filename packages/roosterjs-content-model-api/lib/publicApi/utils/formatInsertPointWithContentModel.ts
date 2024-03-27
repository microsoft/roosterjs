import { addSelectionMarker } from 'roosterjs-content-model-dom/lib/domToModel/utils/addSelectionMarker';
import { buildSelectionMarker } from 'roosterjs-content-model-dom/lib/domToModel/utils/buildSelectionMarker';
import { ensureParagraph } from 'roosterjs-content-model-dom/lib/modelApi/common/ensureParagraph';
import { stackFormat } from 'roosterjs-content-model-dom/lib/domToModel/utils/stackFormat';
import {
    addSegment,
    addTextSegment,
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
    ContentModelText,
    ContentModelDocument,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

interface InsertPointBundle {
    input: DOMInsertPoint;
    result?: InsertPoint;
}

/**
 * Invoke a callback to format the selected image using Content Model
 * @param editor The editor object
 * @param apiName Name of API this calling this function. This is mostly for logging.
 * @param callback The callback to format the image. It will be called with current selected table. If no table is selected, it will not be called.
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
                child: getChildProcessorWithShadowInsertPoint(bundle),
                '#text': getTextProcessorWithShadowInsertPoint(bundle),
            },
        }
    );
}

/**
 * @internal
 */
export interface DomToModelContextWithShadowInsertPoint extends DomToModelContext {
    /**
     * Block group path of this insert point, from direct parent group to the root group
     */
    path?: ContentModelBlockGroup[];
}

function getChildProcessorWithShadowInsertPoint(
    bundle: InsertPointBundle
): ElementProcessor<ParentNode> {
    const handleRegularSelectionWithShadowInsertPoint = getHandleRegularSelectionWithShadowInsertPoint(
        bundle
    );

    return (group, parent, context) => {
        const contextWithShadowInsertPoint = context as DomToModelContextWithShadowInsertPoint;

        contextWithShadowInsertPoint.path = contextWithShadowInsertPoint.path || [];

        let shouldShiftPath = false;
        if (contextWithShadowInsertPoint.path[0] != group) {
            contextWithShadowInsertPoint.path.unshift(group);
            shouldShiftPath = true;
        }

        const offsets = getSelectionOffsetsWithShadowInsertPoint(context, bundle, parent);
        let index = 0;

        for (let child = parent.firstChild; child; child = child.nextSibling) {
            handleRegularSelectionWithShadowInsertPoint(index, context, group, offsets, parent);

            processChildNode(group, child, context);

            index++;
        }

        handleRegularSelectionWithShadowInsertPoint(index, context, group, offsets, parent);

        if (shouldShiftPath) {
            contextWithShadowInsertPoint.path.shift();
        }
    };
}

function getHandleRegularSelectionWithShadowInsertPoint(bundle: InsertPointBundle) {
    return (
        index: number,
        context: DomToModelContext,
        group: ContentModelBlockGroup,
        offsets: [number, number, number],
        container?: Node
    ) => {
        handleRegularSelection(index, context, group, offsets[0], offsets[1], container);

        if (index == offsets[2]) {
            addShadowSelectionMarker(group, context, bundle, container, index);
        }
    };
}

function getSelectionOffsetsWithShadowInsertPoint(
    context: DomToModelContext,
    bundle: InsertPointBundle,
    currentContainer: Node
): [number, number, number] {
    const [start, end] = getRegularSelectionOffsets(context, currentContainer);
    const shadow = bundle.input.node == currentContainer ? bundle.input.offset : -1;

    return [start, end, shadow];
}

/**
 * @internal export for test only
 */
export function getTextProcessorWithShadowInsertPoint(
    bundle: InsertPointBundle
): ElementProcessor<Text> {
    return (group: ContentModelBlockGroup, textNode: Text, context: DomToModelContext) => {
        if (context.formatParsers.text.length > 0) {
            stackFormat(context, { segment: 'shallowClone' }, () => {
                context.formatParsers.text.forEach(parser => {
                    parser(context.segmentFormat, textNode, context);
                    internalTextProcessor(group, textNode, context, bundle);
                });
            });
        } else {
            internalTextProcessor(group, textNode, context, bundle);
        }
    };
}

function internalTextProcessor(
    group: ContentModelBlockGroup,
    textNode: Text,
    context: DomToModelContextWithShadowInsertPoint,
    bundle: InsertPointBundle
) {
    let txt = textNode.nodeValue || '';
    const offsets = getSelectionOffsetsWithShadowInsertPoint(context, bundle, textNode);
    const [start, end, shadow] = offsets;
    const segments: (ContentModelText | undefined)[] = [];
    const paragraph = ensureParagraph(group, context.blockFormat);

    const adjustForShadowInsertPoint = (offsets: [number, number, number]) => {
        const subText = txt.substring(0, offsets[2]);

        segments.push(addTextSegment(group, subText, paragraph, context));

        // Must use offsets[2] here as the unchanged offset value, cannot use txtEndOffset since it has been modified
        // Same for the rest
        addShadowSelectionMarker(group, context, bundle, textNode, shadow);

        txt = txt.substring(offsets[2]);
        offsets[0] -= offsets[2];
        offsets[1] -= offsets[2];
        offsets[2] = -1;
    };

    const adjustForRegularSelection = (
        offsets: [number, number, number],
        offset: number,
        markerOffset: number
    ) => {
        const subText = txt.substring(0, offset);

        segments.push(addTextSegment(group, subText, paragraph, context));
        addSelectionMarker(group, context, textNode, markerOffset);

        txt = txt.substring(offset);
        offsets[0] -= offset;
        offsets[1] -= offset;
        offsets[2] -= offset;
    };

    if (
        offsets[2] >= 0 &&
        (offsets[2] <= offsets[0] || offsets[0] < 0) &&
        (offsets[2] < offsets[1] || offsets[1] < 0)
    ) {
        adjustForShadowInsertPoint(offsets);
    }

    if (offsets[0] >= 0) {
        adjustForRegularSelection(offsets, offsets[0], start);

        context.isInSelection = true;
    }

    if (offsets[2] >= 0 && offsets[2] > offsets[0] && (offsets[2] < offsets[1] || offsets[1] < 0)) {
        adjustForShadowInsertPoint(offsets);
    }

    if (offsets[1] >= 0) {
        adjustForRegularSelection(offsets, offsets[1], end);

        context.isInSelection = false;
    }

    if (offsets[2] >= 0 && offsets[2] >= offsets[1]) {
        adjustForShadowInsertPoint(offsets);
    }

    segments.push(addTextSegment(group, txt, paragraph, context));
    context.domIndexer?.onSegment(
        textNode,
        paragraph,
        segments.filter((x): x is ContentModelText => !!x)
    );
}

function addShadowSelectionMarker(
    group: ContentModelBlockGroup,
    context: DomToModelContextWithShadowInsertPoint,
    bundle: InsertPointBundle,
    container?: Node,
    offset?: number
) {
    const marker = buildSelectionMarker(group, context, container, offset);

    marker.isSelected = false;

    const para = addSegment(group, marker, context.blockFormat, marker.format);
    const { path } = context;

    if (path) {
        bundle.result = {
            path: [...path],
            paragraph: para,
            marker,
        };
    }
}
