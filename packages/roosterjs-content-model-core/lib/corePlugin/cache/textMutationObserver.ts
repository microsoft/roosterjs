import { createDOMHelper } from '../../editor/core/DOMHelperImpl';
import {
    findClosestBlockEntityContainer,
    findClosestEntityWrapper,
    isNodeOfType,
} from 'roosterjs-content-model-dom';
import type { DOMHelper, TextMutationObserver } from 'roosterjs-content-model-types';
import type { Mutation } from './MutationType';

class TextMutationObserverImpl implements TextMutationObserver {
    private observer: MutationObserver;
    private domHelper: DOMHelper;

    constructor(
        private contentDiv: HTMLDivElement,
        private onMutation: (mutation: Mutation) => void
    ) {
        this.observer = new MutationObserver(this.onMutationInternal);
        this.domHelper = createDOMHelper(contentDiv);
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

        const ignoredNodes = new Set<Node>();
        const includedNodes = new Set<Node>();

        for (let i = 0; i < mutations.length && canHandle; i++) {
            const mutation = mutations[i];
            const target = mutation.target;

            if (ignoredNodes.has(target)) {
                continue;
            } else if (!includedNodes.has(target)) {
                if (
                    !this.domHelper.isNodeInEditor(target) ||
                    findClosestEntityWrapper(target, this.domHelper) ||
                    findClosestBlockEntityContainer(target, this.domHelper)
                ) {
                    ignoredNodes.add(target);

                    continue;
                } else {
                    includedNodes.add(target);
                }
            }

            switch (mutation.type) {
                case 'attributes':
                    if (this.domHelper.isNodeInEditor(target, true /*excludingSelf*/)) {
                        if (
                            mutation.attributeName == 'id' &&
                            isNodeOfType(target, 'ELEMENT_NODE')
                        ) {
                            this.onMutation({ type: 'elementId', element: target });
                        } else {
                            // We cannot handle attributes changes on editor content for now
                            canHandle = false;
                        }
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
 * @internal
 */
export function createTextMutationObserver(
    contentDiv: HTMLDivElement,
    onMutation: (mutation: Mutation) => void
): TextMutationObserver {
    return new TextMutationObserverImpl(contentDiv, onMutation);
}
