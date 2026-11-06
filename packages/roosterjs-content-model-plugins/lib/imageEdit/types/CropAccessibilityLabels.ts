/**
 * Localized accessibility text for image crop controls.
 */
export interface CropAccessibilityLabels {
    /**
     * Optional accessible crop corner label. Direction is top left (nw) or bottom right (se).
     * Falls back to "Top left" or "Bottom right" when omitted or empty.
     */
    handleLabel?: (direction: 'nw' | 'se') => string;

    /**
     * Optional accessible label for the whole-image focus target that moves the crop viewport.
     * Falls back to "Move Crop" when omitted or empty.
     */
    moveCropLabel?: string;

    /**
     * Optional localized keyboard cropping instructions. No instructions are added when
     * omitted or empty. Arrow keys move one pixel in screen
     * directions; Tab visits top left, bottom right, then the whole image.
     * Enter applies the crop and Escape cancels it.
     */
    instructions?: string;
}
