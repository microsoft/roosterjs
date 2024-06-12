import type {
    ContentModelDocument,
    DomIndexer,
    TextMutationObserver,
} from 'roosterjs-content-model-types';

class TextMutationObserverImpl implements TextMutationObserver {
    private observer: MutationObserver;

    constructor(
        private contentDiv: HTMLDivElement,
        private domIndexer: DomIndexer,
        private onMutation: (isTextChangeOnly: boolean) => void,
        private onSkipMutation: (newModel: ContentModelDocument) => void
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

    flushMutations(model: ContentModelDocument) {
        const mutations = this.observer.takeRecords();

        if (model) {
            this.onSkipMutation(model);
        } else {
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

        if (canHandle && (addedNodes.length > 0 || removedNodes.length > 0)) {
            canHandle = this.domIndexer.reconcileChildList(addedNodes, removedNodes);
        }

        if (canHandle && reconcileText) {
            this.onMutation(true /*textOnly*/);
        } else if (!canHandle) {
            this.onMutation(false /*textOnly*/);
        }
    };
}

/**
 * @internal
 */
export function createTextMutationObserver(
    contentDiv: HTMLDivElement,
    domIndexer: DomIndexer,
    onMutation: (isTextChangeOnly: boolean) => void,
    onSkipMutation: (newModel: ContentModelDocument) => void
): TextMutationObserver {
    return new TextMutationObserverImpl(contentDiv, domIndexer, onMutation, onSkipMutation);
}
