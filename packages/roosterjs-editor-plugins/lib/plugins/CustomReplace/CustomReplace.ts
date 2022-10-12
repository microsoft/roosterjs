import {
    CustomReplacement,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';

const makeReplacement = (
    sourceString: string,
    replacementHTML: string,
    matchSourceCaseSensitive: boolean,
    shouldReplace?: (
        replacement: CustomReplacement,
        content: string,
        sourceEditor?: IEditor
    ) => boolean
): CustomReplacement => ({
    sourceString,
    replacementHTML,
    matchSourceCaseSensitive,
    shouldReplace,
});

const defaultReplacements: CustomReplacement[] = [
    makeReplacement(':)', '🙂', true),
    makeReplacement(';)', '😉', true),
    makeReplacement(':O', '😲', true),
    makeReplacement(':o', '😯', true),
    makeReplacement('<3', '❤️', true),
];

/**
 * Wrapper for CustomReplaceContentEditFeature that provides an API for updating the
 * content edit feature
 */
export default class CustomReplacePlugin implements EditorPlugin {
    private longestReplacementLength: number | null = null;
    private editor: IEditor | null = null;
    private replacements: CustomReplacement[] | null = null;
    private replacementEndCharacters: Set<string> | null = null;

    /**
     * Create instance of CustomReplace plugin
     * @param replacements Replacement rules. If not passed, a default replacement rule set will be applied
     */
    constructor(replacements: CustomReplacement[] = defaultReplacements) {
        this.updateReplacements(replacements);
    }

    /**
     * Set the replacements that this plugin is looking for.
     * @param newReplacements new set of replacements for this plugin
     */
    updateReplacements(newReplacements: CustomReplacement[]) {
        this.replacements = newReplacements;
        this.longestReplacementLength = getLongestReplacementSourceLength(this.replacements);
        this.replacementEndCharacters = getReplacementEndCharacters(this.replacements);
    }

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'CustomReplace';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: IEditor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent) {
        if (event.eventType != PluginEventType.Input || !this.editor || this.editor.isInIME()) {
            return;
        }

        // Exit early on input events that do not insert a replacement's final character.
        if (!event.rawEvent.data || !this.replacementEndCharacters?.has(event.rawEvent.data)) {
            return;
        }

        // Get the matching replacement
        const searcher = this.editor.getContentSearcherOfCursor(event);
        if (!searcher || this.longestReplacementLength == null) {
            return;
        }
        const stringToSearch = searcher.getSubStringBefore(this.longestReplacementLength);

        const replacement = this.getMatchingReplacement(stringToSearch);

        if (
            !replacement ||
            (replacement.shouldReplace &&
                searcher &&
                !replacement.shouldReplace(replacement, searcher.getWordBefore(), this.editor))
        ) {
            return;
        }

        // Reconstruct a selection of the text on the document that matches the
        // replacement we selected.
        const matchingText = searcher.getSubStringBefore(replacement.sourceString.length);
        const matchingRange = searcher.getRangeFromText(matchingText, true /* exactMatch */);

        // parse the html string off the dom and inline the resulting element.
        const document = this.editor.getDocument();
        const parsingSpan = document.createElement('span');
        parsingSpan.innerHTML = this.editor.getTrustedHTMLHandler()(replacement.replacementHTML);
        const nodeToInsert =
            parsingSpan.childNodes.length == 1 ? parsingSpan.childNodes[0] : parsingSpan;

        // Switch the node for the selection range
        if (matchingRange) {
            this.editor.addUndoSnapshot(
                () => {
                    matchingRange.deleteContents();
                    matchingRange.insertNode(nodeToInsert);
                    this.editor?.select(nodeToInsert, PositionType.End);
                },
                undefined /*changeSource*/,
                true /*canUndoByBackspace*/
            );
        }
    }

    private getMatchingReplacement(stringToSearch: string): CustomReplacement | null {
        if (stringToSearch.length == 0 || !this.replacements) {
            return null;
        }
        const originalStringToSearch = stringToSearch.replace(/\s/g, ' ');
        const lowerCaseStringToSearch = originalStringToSearch.toLocaleLowerCase();
        for (const replacement of this.replacements) {
            const [sourceMatch, replacementMatch] = replacement.matchSourceCaseSensitive
                ? [originalStringToSearch, replacement.sourceString]
                : [lowerCaseStringToSearch, replacement.sourceString.toLocaleLowerCase()];

            if (
                sourceMatch.substring(sourceMatch.length - replacementMatch.length) ==
                replacementMatch
            ) {
                return replacement;
            }
        }
        return null;
    }
}

function getLongestReplacementSourceLength(replacements: CustomReplacement[]): number {
    return Math.max.apply(
        null,
        replacements.map(replacement => replacement.sourceString.length)
    );
}

function getReplacementEndCharacters(replacements: CustomReplacement[]): Set<string> {
    const endChars = new Set<string>();
    for (let replacement of replacements) {
        const sourceString = replacement.sourceString;
        if (sourceString.length == 0) {
            continue;
        }
        const lastChar = sourceString[sourceString.length - 1];
        if (!replacement.matchSourceCaseSensitive) {
            endChars.add(lastChar.toLocaleLowerCase());
            endChars.add(lastChar.toLocaleUpperCase());
        } else {
            endChars.add(lastChar);
        }
    }
    return endChars;
}
