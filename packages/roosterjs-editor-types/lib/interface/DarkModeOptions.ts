import { DefaultFormat } from 'roosterjs-editor-types';

/**
 * The options to specify dark mode editor behavior
 */
interface DarkModeOptions {
    /**
     * Default formating used for dark mode content. This will be applied to empty content.
     * If there is already content inside editor, format of existing content will not be changed.
     * Default value is a set of styles located in INSERT_FILE_HERE.
     */
    defaultFormat?: DefaultFormat;

    /**
     * RoosterJS provides an experemental "external content handler" that transforms text
     * This is used when content is pasted or inserted via a method we can hook into.
     * This transform is currently "lossy" and will eliminate color information.
     * If you want change this behavior, you may define a different function here.
     * It takes in the impacted HTMLElement
     */
    onExternalContentTransform?: (htmlIn: HTMLElement) => void;
}

export default DarkModeOptions;