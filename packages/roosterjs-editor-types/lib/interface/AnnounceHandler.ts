import AnnounceData from './AnnounceData';

/**
 * A handler object for announcing text to screen reader.
 */

export default interface AnnounceHandler {
    /**
     * Announce new text to screen reader.
     * @param announceData Data to be announced.
     * @param text additional text to format the announceData if needed.
     * @returns
     */
    announce: (announceData: AnnounceData) => void;

    /**
     * Reset known color record, clean up registered color variables.
     */
    dispose: () => void;
}
