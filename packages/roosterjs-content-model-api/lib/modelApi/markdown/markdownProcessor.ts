import { createBlockGroupFromMarkdown } from './creators/createBlockgroupFromMarkdown';
import { createContentModelDocument, createDivider } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from './creators/createParagraphFromMarkdown';
import { createTableFromMarkdown } from './creators/createTableFromMarkdown';
import type {
    ContentModelBlockGroup,
    ContentModelBlockType,
    ContentModelDocument,
    ContentModelTable,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

const MarkdownPattern: Record<string, RegExp> = {
    heading: /^#{1,6} .*/,
    horizontal_line: /^---$/,
    blockquote: /^>\s.*$/,
    paragraph: /^[^#\-\*\d\|].*/,
    unordered_list: /^\* .*/,
    ordered_list: /^\d+\. .*/,
    table: /^\|.*\|$/,
};

const MarkdownBlockType: Record<string, ContentModelBlockType> = {
    heading: 'Paragraph',
    horizontal_line: 'Divider',
    paragraph: 'Paragraph',
    unordered_list: 'BlockGroup',
    ordered_list: 'BlockGroup',
    table: 'Table',
    blockquote: 'BlockGroup',
};

/**
 * @internal
 * Process markdown text and convert it to ContentModelDocument
 * @param text The markdown text
 * @returns The ContentModelDocument
 */

export function markdownProcessor(text: string): ContentModelDocument {
    const markdownText = text.replace(/\\n\\n/g, '\n\n').split(/\r\n|\r|\\n|\n/);
    const doc = createContentModelDocument();
    return convertMarkdownText(doc, markdownText);
}

function addMarkdownBlockToModel(
    model: ShallowMutableContentModelDocument,
    blockType: ContentModelBlockType,
    markdown: string,
    patternName: string,
    table?: ContentModelTable,
    group?: ContentModelBlockGroup
): {
    table: ContentModelTable | undefined;
    group: ContentModelBlockGroup | undefined;
} {
    switch (blockType) {
        case 'Paragraph':
            const paragraph = createParagraphFromMarkdown(markdown);
            model.blocks.push(paragraph);
            table = undefined;
            group = undefined;
            break;
        case 'Divider':
            const divider = createDivider('hr');
            model.blocks.push(divider);
            table = undefined;
            group = undefined;
            break;
        case 'BlockGroup':
            const blockGroup = createBlockGroupFromMarkdown(markdown, patternName, group);
            model.blocks.push(blockGroup);
            table = undefined;
            group = blockGroup;
            break;
        case 'Table':
            table = createTableFromMarkdown(markdown, table);
            model.blocks.push(table);
            group = undefined;
            break;
    }

    return { table, group };
}

function convertMarkdownText(model: ContentModelDocument, lines: string[]): ContentModelDocument {
    let tableModel: ContentModelTable | undefined = undefined;
    let groupModel: ContentModelBlockGroup | undefined = undefined;
    for (const line of lines) {
        let matched = false;
        for (const patternName in MarkdownPattern) {
            if (MarkdownPattern.hasOwnProperty(patternName)) {
                const pattern = MarkdownPattern[patternName];
                if (pattern.test(line)) {
                    const { table, group } = addMarkdownBlockToModel(
                        model,
                        MarkdownBlockType[patternName],
                        line,
                        patternName,
                        tableModel,
                        groupModel
                    );
                    tableModel = table;
                    groupModel = group;
                    matched = true;
                    break;
                }
            }
        }

        if (!matched) {
            addMarkdownBlockToModel(model, 'Paragraph', line, 'paragraph');
        }
    }
    return model;
}
