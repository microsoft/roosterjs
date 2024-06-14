import type { TextMutationObserver } from 'roosterjs-content-model-types';

class TextMutationObserverImpl implements TextMutationObserver {
    private observer: MutationObserver;

    constructor(
        private contentDiv: HTMLDivElement,
        private onMutation: (mutation: Mutation) => void
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

    flushMutations(ignoreMutations?: boolean) {
        const mutations = this.observer.takeRecords();

        if (!ignoreMutations) {
            this.onMutationInternal(mutations);
        }
    }

    private onMutationInternal = (mutations: MutationRecord[]) => {
        let canHandle = true;
        let firstTarget: Node | null = null;
        let lastTextChangeNode: Node | null = null;
        let addedNodes: Node[] = [];
        let removedNodes: Node[] = [];
        let reconcileText = false;

        for (let i = 0; i < mutations.length && canHandle; i++) {
            const mutation = mutations[i];

            switch (mutation.type) {
                case 'attributes':
                    if (mutation.target != this.contentDiv) {
                        // We cannot handle attributes changes on editor content for now
                        canHandle = false;
                    }
                    break;

                case 'characterData':
                    if (lastTextChangeNode && lastTextChangeNode != mutation.target) {
                        // Multiple text nodes got changed, we don't know how to handle it
                        canHandle = false;
                    } else {
                        lastTextChangeNode = mutation.target;
                        reconcileText = true;
                    }
                    break;

                case 'childList':
                    if (!firstTarget) {
                        firstTarget = mutation.target;
                    } else if (firstTarget != mutation.target) {
                        canHandle = false;
                    }

                    if (canHandle) {
                        addedNodes = addedNodes.concat(Array.from(mutation.addedNodes));
                        removedNodes = removedNodes.concat(Array.from(mutation.removedNodes));
                    }

                    break;
            }
        }

        if (canHandle) {
            if (addedNodes.length > 0 || removedNodes.length > 0) {
                this.onMutation({
                    type: 'childList',
                    addedNodes,
                    removedNodes,
                });
            }

            if (reconcileText) {
                this.onMutation({ type: 'text' });
            }
        } else {
            this.onMutation({ type: 'unknown' });
        }
    };
}

/**
 * @internal Type of mutations
 */
export type MutationType =
    /**
     * We found some change happened but we cannot handle it, so set mutation type as "unknown"
     */
    | 'unknown'
    /**
     * Only text is changed
     */
    | 'text'
    /**
     * Child list is changed
     */
    | 'childList';

/**
 * @internal
 */
export interface MutationBase<T extends MutationType> {
    type: T;
}

/**
 * @internal
 */
export interface UnknownMutation extends MutationBase<'unknown'> {}

/**
 * @internal
 */
export interface TextMutation extends MutationBase<'text'> {}

/**
 * @internal
 */
export interface ChildListMutation extends MutationBase<'childList'> {
    addedNodes: Node[];
    removedNodes: Node[];
}

/**
 * @internal
 */
export type Mutation = UnknownMutation | TextMutation | ChildListMutation;

/**
 * @internal
 */
export function createTextMutationObserver(
    contentDiv: HTMLDivElement,
    onMutation: (mutation: Mutation) => void
): TextMutationObserver {
    return new TextMutationObserverImpl(contentDiv, onMutation);
}
