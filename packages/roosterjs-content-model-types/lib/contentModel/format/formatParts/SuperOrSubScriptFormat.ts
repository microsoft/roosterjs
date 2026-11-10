/**
 * Format of superscript/subscript
 */
export type SuperOrSubScriptFormat = {
    /**
     * Sequence of superscript/subscript
     * e.g. sub super sub
     */
    superOrSubScriptSequence?: string;

    /**
     * Inherit the segment's font size instead of shrinking superscript/subscript wrappers.
     * An empty value restores the default wrapper size.
     */
    superOrSubScriptFontSize?: 'inherit' | '';
};
