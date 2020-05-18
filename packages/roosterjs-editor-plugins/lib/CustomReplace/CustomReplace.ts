import { cacheGetContentSearcher, Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType, PositionType } from 'roosterjs-editor-types';

/**
 * An interface to define a replacement rule for CustomReplace plugin
 */
export type Replacement = {
    /**
     * Source string to replace from
     */
    sourceString: string;

    /**
     * HTML string to replace to
     */
    replacementHTML: string;

    /**
     * Whether the matching should be case sensitive
     */
    matchSourceCaseSensitive: boolean;
};

const makeReplacement = (
    sourceString: string,
    replacementHTML: string,
    matchSourceCaseSensitive: boolean
): Replacement => ({ sourceString, replacementHTML, matchSourceCaseSensitive });

const defaultReplacements: Replacement[] = [
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
    private longestReplacementLength: number;
    private editor: Editor;
    private replacements: Replacement[];
    private replacementEndCharacters: Set<string>;

    /**
     * Create instance of CustomReplace plugin
     * @param replacements Replacement rules. If not passed, a default replacement rule set will be applied
     */
    constructor(replacements: Replacement[] = defaultReplacements) {
        this.updateReplacements(replacements);
    }

    /**
     * Set the replacements that this plugin is looking for.
     * @param newReplacements new set of replacements for this plugin
     */
    updateReplacements(newReplacements: Replacement[]) {
        this.replacements = newReplacements;
        this.longestReplacementLength = getLongestReplacementSourceLength(this.replacements);
        this.replacementEndCharacters = getReplacementEndCharacters(this.replacements);
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
        this.editor = null;
    }

    public onPluginEvent(event: PluginEvent) {
        if (this.editor.isInIME() || event.eventType != PluginEventType.Input) {
            return;
        }

        // Exit early on input events that do not insert a replacement's final character.
        if (!event.rawEvent.data || !this.replacementEndCharacters.has(event.rawEvent.data)) {
            return;
        }

        // Get the matching replacement
        const range = this.editor.getSelectionRange();
        if (range == null) {
            return;
        }
        const searcher = cacheGetContentSearcher(event, this.editor);
        const stringToSearch = searcher.getSubStringBefore(this.longestReplacementLength);

        const replacement = this.getMatchingReplacement(stringToSearch);
        if (replacement == null) {
            return;
        }

        // Reconstruct a selection of the text on the document that matches the
        // replacement we selected.
        const matchingText = searcher.getSubStringBefore(replacement.sourceString.length);
        const matchingRange = searcher.getRangeFromText(matchingText, true /* exactMatch */);

        // parse the html string off the dom and inline the resulting element.
        const document = this.editor.getDocument();
        const parsingSpan = document.createElement('span');
        parsingSpan.innerHTML = replacement.replacementHTML;
        const nodeToInsert =
            parsingSpan.childNodes.length == 1 ? parsingSpan.childNodes[0] : parsingSpan;

        // Switch the node for the selection range
        this.editor.performAutoComplete(() => {
            matchingRange.deleteContents();
            matchingRange.insertNode(nodeToInsert);
            this.editor.select(nodeToInsert, PositionType.End);
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

function getLongestReplacementSourceLength(replacements: Replacement[]): number {
    return Math.max.apply(
        null,
        replacements.map(replacement => replacement.sourceString.length)
    );
}

function getReplacementEndCharacters(replacements: Replacement[]): Set<string> {
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
