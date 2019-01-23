/**
 * The options to specify dark mode editor behavior
 */
interface DarkModeOptions {
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