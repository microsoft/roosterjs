import { ContentModelFormatBase, FormatApplier, FormatParser } from 'roosterjs-content-model-types';

interface ClassFormat extends ContentModelFormatBase {
    className?: string;
}

interface ClassFormatHandler {
    /**
     * Parse format from the given HTML element and default style
     */
    parse: FormatParser<ClassFormat>;

    /**
     * Apply format to the given HTML element
     */
    apply: FormatApplier<ClassFormat>;
}

export const classFormatHandler: ClassFormatHandler = {
    parse: (format, element) => {
        const className = element.className;
        if (className) {
            format.className = element.className;
        }
    },
    apply: (format, element) => {
        // Custom formatting logic for class elements
        const className = format.className;
        if (className) {
            element.className = className;
        }
    },
};
