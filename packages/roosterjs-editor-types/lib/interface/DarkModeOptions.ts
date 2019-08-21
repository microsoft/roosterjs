/**
 * The options to specify dark mode editor behavior
 */
interface DarkModeOptions {
    /** Transform on insert controls if, when the editor is initialized, content should be transformed for dark mode.
     *  Set this to true to run the content being set to the editor through an initial transform into dark mode.
     *  Set this to false if you are setting dark mode compliant content initialy.
     */
    transformOnInitialize?: boolean;

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
