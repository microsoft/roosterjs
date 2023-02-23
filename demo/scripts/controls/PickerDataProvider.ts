import { PickerDataProvider } from 'roosterjs-editor-types';

export class MentionPickerDataProvider implements PickerDataProvider {
    private commitMentionCallback?: (element: HTMLElement) => void;

    onInitalize(
        commitMentionCallback: (element: HTMLElement) => void,
        _setIsSuggestingCallback: (isSuggesting: boolean) => void
    ): void {
        this.commitMentionCallback = commitMentionCallback;
    }

    onDispose(): void {}
    queryStringUpdated(queryString: string): void {
        if (queryString === 'yu') {
            // create a div with test "person"
            const node = document.createElement('div');
            node.innerText = 'person';

            this.commitMentionCallback(node);
        }
    }

    onRemove(nodeRemoved: Node, isBackwards: boolean): Node {
        return null;
    }

    onIsSuggestingChanged(isSuggesting: boolean): void {
        // no op
    }
}
