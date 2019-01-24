import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PositionType, PluginEvent, PluginEventType, PluginKeyPressEvent } from 'roosterjs-editor-types';

type Replacement = {
    sourceString: string,
    replacementHTML: string,
    matchSourceCaseSensitive: boolean
}

const makeReplacement = (sourceString: string, replacementHTML: string, matchSourceCaseSensitive: boolean): Replacement =>
    ({ sourceString, replacementHTML, matchSourceCaseSensitive });
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
    private replacementEndCharacters: Set<string>;
    private editor: Editor;

    /**
     * Create instance of CustomReplace plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(private replacements: Replacement[] = defaultReplacements) {
        this.longestReplacementLength = getLongestReplacementSourceLength(this.replacements);
        this.replacementEndCharacters = getReplacementEndCharacters(this.replacements);
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
        if (this.editor.isInIME() || event.eventType != PluginEventType.KeyPress) {
            return;
        }

        // Exit early on keyboard events that do not use a replacement's final character.
        if (!this.replacementEndCharacters.has(event.rawEvent.key)) {
            return
        }

        // This handler fires before the event's native behaviour -- defer until after it completes
        setTimeout(() => this.editor.isDisposed() || this.handlePluginEvent(event), 0);
    }

    private handlePluginEvent(event: PluginKeyPressEvent): void {
        // Get the matching replacement
        const range = this.editor.getSelectionRange();
        if (range == null) return;
        const searcher = this.editor.getContentSearcherOfCursor();
        const stringToSearch = searcher.getSubStringBefore(this.longestReplacementLength);

        // Do nothing on control / navigation keys (e.g. keys that did not just type the last character)
        if (!stringToSearch.endsWith(event.rawEvent.key)) {
            return
        }

        const replacement = this.getMatchingReplacement(stringToSearch);
        console.log('replacement', replacement);
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

            if (sourceMatch.substring(sourceMatch.length - replacementMatch.length) == replacementMatch) {
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

function getReplacementEndCharacters(replacements: Replacement[]): Set<string> {
    const endChars = new Set();
    for (let replacement of replacements) {
        const sourceString = replacement.sourceString;
        if (sourceString.length == 0) continue;
        const lastChar = sourceString[sourceString.length - 1]
        if (!replacement.matchSourceCaseSensitive) {
            endChars.add(lastChar.toLocaleLowerCase());
            endChars.add(lastChar.toLocaleUpperCase());
        } else {
            endChars.add(lastChar);
        }
    }
    console.log(Array.from(endChars));
    return endChars;
}
