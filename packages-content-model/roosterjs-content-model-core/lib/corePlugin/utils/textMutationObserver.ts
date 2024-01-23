import type { TextMutationObserver } from 'roosterjs-content-model-types';

class TextMutationObserverImpl implements TextMutationObserver {
    private observer: MutationObserver;

    constructor(
        private contentDiv: HTMLDivElement,
        private onMutation: (isTextChangeOnly: boolean) => void
    ) {
        this.observer = new MutationObserver(this.onMutationInternal);
    }

    startObserving() {
        this.observer.observe(this.contentDiv, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true,
        });
    }

    stopObserving() {
        this.observer.disconnect();
    }

    flushMutations() {
        this.observer.takeRecords();
    }

    private onMutationInternal = (mutations: MutationRecord[]) => {
        const firstTarget = mutations[0]?.target;
        const isTextChangeOnly = mutations.every(
            mutation => mutation.type == 'characterData' && mutation.target == firstTarget
        );

        this.onMutation(isTextChangeOnly);
    };
}

/**
 * @internal
 */
export function createTextMutationObserver(
    contentDiv: HTMLDivElement,
    onMutation: (isTextChangeOnly: boolean) => void
): TextMutationObserver {
    return new TextMutationObserverImpl(contentDiv, onMutation);
}
