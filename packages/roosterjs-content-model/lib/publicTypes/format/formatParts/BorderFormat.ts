/**
 * Format of border
 */
export type BorderFormat = {
    /**
     * Border width in order: "top right bottom left"
     */
    borderWidth?: string;

    /**
     * Border style in order: "top right bottom left"
     */
    borderStyle?: string;

    /**
     * Border color in order: "top right bottom left"
     */
    borderColor?: string;

    /**
     * Whether use border-box for this element
     */
    useBorderBox?: boolean;
};
