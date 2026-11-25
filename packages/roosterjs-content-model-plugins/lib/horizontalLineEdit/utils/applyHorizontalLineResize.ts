import { getHorizontalLineHeightFormat } from './resizeHorizontalLine';
import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import type { HorizontalLineResizeContext } from '../types/HorizontalLineResizeContext';
import type { ContentModelDivider, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Commit explicit dimensions without their original size constraints, and resolve the next line
 * if rendering replaces its DOM node. Preserve height constraints when height is unchanged.
 */
export function applyHorizontalLineResize(
    editor: IEditor,
    context: HorizontalLineResizeContext,
    nextLine?: HTMLHRElement
) {
    const {
        line,
        dimensions,
        originalDimensions,
        widthAdjustment,
        horizontalBorderWidth,
        useBorderBox,
    } = context;
    let nextDivider: ContentModelDivider | undefined;
    let nextElement = nextLine;

    if (
        !editor.isDisposed() &&
        editor.getDOMHelper().isNodeInEditor(line) &&
        (dimensions.width !== originalDimensions.width ||
            dimensions.height !== originalDimensions.height)
    ) {
        const heightFormat =
            dimensions.height !== originalDimensions.height
                ? getHorizontalLineHeightFormat(context)
                : null;
        const resizedWidthAdjustment = heightFormat
            ? widthAdjustment - horizontalBorderWidth + 2
            : widthAdjustment;
        let changed = false;
        editor.formatContentModel(
            () => changed,
            {
                apiName: 'HorizontalLineEdit',
                onNodeCreated: (model, node) => {
                    if (
                        model === nextDivider &&
                        isNodeOfType(node, 'ELEMENT_NODE') &&
                        isElementOfType(node, 'hr')
                    ) {
                        nextElement = node;
                    }
                },
            },
            {
                processorOverride: {
                    hr: (group, element, context) => {
                        context.defaultElementProcessors.hr?.(group, element, context);
                        const divider = group.blocks[group.blocks.length - 1];
                        if (divider?.blockType == 'Divider') {
                            if (element === nextLine) {
                                nextDivider = divider;
                            }
                            if (element === line) {
                                divider.format.display = 'table';
                                divider.format.useBorderBox = useBorderBox;
                                divider.format.width =
                                    dimensions.width -
                                    (useBorderBox ? 0 : resizedWidthAdjustment) +
                                    'px';
                                divider.format.minWidth = '0';
                                divider.format.maxWidth = 'none';
                                if (heightFormat) {
                                    Object.assign(divider.format, heightFormat);
                                    divider.format.minHeight = '0';
                                    divider.format.maxHeight = 'none';
                                }
                                changed = true;
                            }
                        }
                    },
                },
            }
        );
    }
    return nextElement;
}
