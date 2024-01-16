import type TargetWindowBase from './TargetWindowBase';

/**
 * Define DOM types of window, used by safeInstanceOf() to check if a given object is of the specified type of its own window
 */
export default interface TargetWindow extends TargetWindowBase {
    /**
     * @deprecated Just for backward compatibility
     */
    SVGCursorElement: Element;

    /**
     * @deprecated Just for backward compatibility
     */
    HTMLBaseFontElement: Element;

    /**
     * @deprecated Just for backward compatibility
     */
    HTMLAppletElement: Element;
}
