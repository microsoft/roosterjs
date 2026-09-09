# Markdown conversion

`convertMarkdownToContentModel` recognizes backtick and tilde fenced code blocks,
including quoted fences, list-item fences, and indented list continuations. Fence
bodies are literal: inline Markdown, blank-line merging, and the legacy `\\n`
splitting convention do not apply. Physical CRLF/CR line endings normalize to LF.
An unclosed fence consumes the rest of its container.

The default representation is a `pre` format container. Its `codeBlock` field stores
only the info string and delimiter; text segments remain the source of truth.
RoosterJS DOM conversion and model cloning preserve this metadata. Markdown export
lengthens delimiters when necessary so the body cannot accidentally close its fence.
This extends the existing Markdown converter, not its overall CommonMark compliance.

## Custom blocks

```ts
const model = convertMarkdownToContentModel(markdown, {
    onFencedCodeBlock: block => {
        // Return a ContentModelBlock, or undefined for the default literal PRE.
        return block.info === 'my-language' ? createCustomBlock(block.source) : undefined;
    },
});

const markdown = convertContentModelToMarkdown(model, undefined, {
    // Invoked recursively, including within lists and blockquotes.
    onBlock: block => serializeCustomBlock(block),
});
```

A custom serializer returns `undefined` to retain the default behavior. Use
`serializeFencedCodeBlock(source, info, fence)` for safe fence serialization.
`MarkdownPastePlugin` accepts the same import options through `markdownOptions`
for both automatic conversion and explicit Paste as Markdown.

Block content inside Markdown pipe tables remains subject to the existing table
serializer's limitations. Use HTML when a table cell must contain rich blocks.
