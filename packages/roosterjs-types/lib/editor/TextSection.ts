import InlineElement from './InlineElement';

// This represents a text section before cursor
// This is mostly used by "suggestions" like plugin, i.e. Mentions where they need both textual info
// to see if text matches an entity, and DOM node (i.e. for Mentions, they need DOM node that contains @)
// where they know how to anchor popup
// For convenience, the wholeText represents all text read so up to the cursor, not just the inline element
interface TextSection {
    // The whole text of this section
    wholeText: string;

    // Inline element of this section
    inlineElement: InlineElement;
}

export default TextSection;
