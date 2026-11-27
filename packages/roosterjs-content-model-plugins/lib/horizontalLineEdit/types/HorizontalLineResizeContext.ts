import type { DragAndDropHelper } from '../../pluginUtils/DragAndDrop/DragAndDropHelper';
import type { HorizontalLineEditOptions } from '../HorizontalLineEditOptions';

/**
 * @internal
 */
export interface HorizontalLineDimensions {
    width: number;
    height: number;
}

/**
 * @internal
 * State shared by the resize handles for one horizontal line.
 */
export interface HorizontalLineResizeContext {
    line: HTMLHRElement;
    host: HTMLSpanElement;
    wrapper: HTMLDivElement;
    preview: HTMLHRElement;
    dimensions: HorizontalLineDimensions;
    originalDimensions: HorizontalLineDimensions;
    widthAdjustment: number;
    horizontalBorderWidth: number;
    originalVerticalFormat: Pick<
        CSSStyleDeclaration,
        | 'borderTop'
        | 'borderBottom'
        | 'borderLeft'
        | 'borderRight'
        | 'backgroundColor'
        | 'paddingTop'
        | 'paddingBottom'
    >;
    useBorderBox: boolean;
    handles: Map<EventTarget, HorizontalLineResizeHandleContext>;
    helpers: DragAndDropHelper<HorizontalLineResizeHandleContext, HorizontalLineDimensions>[];
}

/**
 * @internal
 * Resize state and direction for an individual handle.
 */
export interface HorizontalLineResizeHandleContext {
    context: HorizontalLineResizeContext;
    horizontal: number;
    vertical: number;
    options: HorizontalLineEditOptions;
}
