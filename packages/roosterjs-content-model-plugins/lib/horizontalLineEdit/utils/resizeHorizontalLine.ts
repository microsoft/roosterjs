import type { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { ContentModelDividerFormat } from 'roosterjs-content-model-types';
import type {
    HorizontalLineDimensions,
    HorizontalLineResizeContext,
    HorizontalLineResizeHandleContext,
} from '../types/HorizontalLineResizeContext';

/**
 * @internal
 * Shared mouse and touch resize handler.
 */
export const HorizontalLineResizer: DragAndDropHandler<
    HorizontalLineResizeHandleContext,
    HorizontalLineDimensions
> = {
    onDragStart: ({ context }) => ({ ...context.dimensions }),
    onDragging: (context, _event, initial, deltaX, deltaY) => {
        resizeHorizontalLine(context, initial, deltaX, deltaY);
        return false;
    },
    onDragEnd: () => true,
};

/**
 * @internal
 * Resize from a drag's initial dimensions or the current keyboard dimensions.
 */
export function resizeHorizontalLine(
    { context, horizontal, vertical, options }: HorizontalLineResizeHandleContext,
    initial: HorizontalLineDimensions,
    deltaX: number,
    deltaY: number
) {
    context.dimensions.width = horizontal
        ? Math.max(
              options.minWidth ?? 10,
              context.widthAdjustment,
              initial.width + deltaX * horizontal
          )
        : initial.width;
    context.dimensions.height = vertical
        ? Math.max(options.minHeight ?? 2, 2, initial.height + deltaY * vertical)
        : initial.height;
    updateHorizontalLinePreview(context);
}

/**
 * @internal
 */
export function updateHorizontalLinePreview(context: HorizontalLineResizeContext) {
    const { wrapper, preview, dimensions, originalDimensions, originalVerticalFormat } = context;
    wrapper.style.width = dimensions.width + 'px';
    wrapper.style.height = dimensions.height + 'px';
    Object.assign(
        preview.style,
        originalVerticalFormat,
        dimensions.height !== originalDimensions.height
            ? {
                  ...getHorizontalLineHeightFormat(context),
                  height: dimensions.height + 'px',
              }
            : { height: '100%' }
    );
}

/**
 * @internal
 * Use a gray outline with a transparent center for a vertically resized divider.
 */
export function getHorizontalLineHeightFormat({
    dimensions,
    useBorderBox,
}: HorizontalLineResizeContext): ContentModelDividerFormat {
    return {
        borderTop: '1px solid gray',
        borderBottom: '1px solid gray',
        borderLeft: '1px solid gray',
        borderRight: '1px solid gray',
        backgroundColor: 'transparent',
        height: dimensions.height - (useBorderBox ? 0 : 2) + 'px',
        paddingTop: '0px',
        paddingBottom: '0px',
    };
}
