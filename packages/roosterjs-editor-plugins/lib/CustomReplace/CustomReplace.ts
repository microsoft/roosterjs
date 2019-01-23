import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType, PluginKeyPressEvent } from 'roosterjs-editor-types';

type Replacement = {
    sourceString: string,
    replacementHTML: string,
    matchSourceCaseSensitive: boolean
}

const defaultReplacements: Replacement[] = [
    {
        sourceString: ':)',
        replacementHTML: '🙂',
        matchSourceCaseSensitive: true,
    },
    {
        sourceString: ';)',
        replacementHTML: '😉',
        matchSourceCaseSensitive: true,
    },
    {
        sourceString: ':O',
        replacementHTML: '😲',
        matchSourceCaseSensitive: true,
    },
    {
        sourceString: ':o',
        replacementHTML: '😯',
        matchSourceCaseSensitive: true,
    },
    {
        sourceString: '<3',
        replacementHTML: '❤️',
        matchSourceCaseSensitive: true,
    },
]

/**
 * Wrapper for CustomReplaceContentEditFeature that provides an API for updating the
 * content edit feature
 */
export default class CustomReplacePlugin implements EditorPlugin {
    private longestReplacementLength: number;
    private editor: Editor;

    /**
     * Create instance of CustomReplace plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(private replacements: Replacement[] = defaultReplacements) {
        this.longestReplacementLength = getLongestReplacementSourceLength(this.replacements);
    }

    updateReplacements(newReplacements: Replacement[]) {
        this.replacements = newReplacements;
        this.longestReplacementLength = getLongestReplacementSourceLength(this.replacements);
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'CustomReplace';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
    }

    public onPluginEvent(event: PluginEvent) {
        if (this.editor.isInIME() || event.eventType != PluginEventType.KeyPress) {
            return;
        }

        // This handler fires before the event's native behaviour -- defer until after it completes
        setTimeout(() => this.handlePluginEvent(event), 0)
    }

    private handlePluginEvent(event: PluginKeyPressEvent) {
        // Get the matching replacement
        const range = document.getSelection().getRangeAt(0);
        if (range == null) return;
        const searcher = this.editor.getContentSearcherOfCursor();
        const stringToSearch = searcher.getSubStringBefore(this.longestReplacementLength);

        // Do nothing on control / navigation keys (e.g. keys that did not just type the last character)
        if (!stringToSearch.endsWith(event.rawEvent.key)) {
            return
        }

        const replacement = this.getMatchingReplacement(stringToSearch);
        if (replacement == null) return;

        // Reconstruct a selection of the text on the document that matches the
        // replacement we selected.
        const matchingText = searcher.getSubStringBefore(replacement.sourceString.length)
        const matchingRange = searcher.getRangeFromText(matchingText, true /* exactMatch */);

        // parse the html string off the dom and inline the resulting element.
        const parsingSpan = document.createElement('span');
        parsingSpan.innerHTML = replacement.replacementHTML;
        const nodeToInsert = (parsingSpan.childNodes.length == 1) ? parsingSpan.childNodes[0] : parsingSpan;

        // Switch the node for the selection range
        this.editor.addUndoSnapshot(() => {
            matchingRange.deleteContents();
            matchingRange.insertNode(nodeToInsert);
            if (nodeToInsert instanceof Text) {
                // Fix backspace after text node insertion
                // (when collapsing the range to the end, the selection goes _after_ the text
                // node, which lets it delete half of the unicode multipart heart.)
                const endOfTextNodeRange = new Range();
                endOfTextNodeRange.setStart(nodeToInsert, nodeToInsert.length);
                endOfTextNodeRange.setEnd(nodeToInsert, nodeToInsert.length);
                this.editor.select(endOfTextNodeRange);
            } else {
                // Collapse the range to the end and select it
                matchingRange.collapse(false /* toStart */)
                this.editor.select(matchingRange);
            }
        });

    }

    private getMatchingReplacement(stringToSearch: string): Replacement | null {
        if (stringToSearch.length == 0) {
            return null;
        }
        const lowerCaseStringToSearch = stringToSearch.toLocaleLowerCase();
        for (const replacement of this.replacements) {
            const [sourceMatch, replacementMatch] = replacement.matchSourceCaseSensitive
                ? [stringToSearch, replacement.sourceString]
                : [lowerCaseStringToSearch, replacement.sourceString.toLocaleLowerCase()];

            if (sourceMatch.endsWith(replacementMatch)) {
                return replacement;
            }
        }
        return null;
    }
}

function getLongestReplacementSourceLength(replacements: Replacement[]): number {
    return Math.max.apply(null, replacements
        .map(replacement => replacement.sourceString.length)
    );
}
