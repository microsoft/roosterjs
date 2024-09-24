import * as clearModelFormat from '../../../lib/modelApi/common/clearModelFormat';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { clearFormat } from '../../../lib/publicApi/format/clearFormat';
import { IEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';

describe('clearFormat', () => {
    it('Clear format', () => {
        const model = ('Model' as any) as ContentModelDocument;
        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toEqual('clearFormat');
                callback(model, { newEntities: [], deletedEntities: [], newImages: [] });
            });

        const editor = ({
            focus: () => {},
            formatContentModel: formatContentModelSpy,
        } as any) as IEditor;

        spyOn(clearModelFormat, 'clearModelFormat');
        spyOn(normalizeContentModel, 'normalizeContentModel');

        clearFormat(editor);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(clearModelFormat.clearModelFormat).toHaveBeenCalledTimes(1);
        expect(clearModelFormat.clearModelFormat).toHaveBeenCalledWith(model, [], [], []);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledTimes(1);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(model);
    });

    it('Clear format with list under quote', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    tagName: 'blockquote',
                    blockType: 'BlockGroup',
                    format: {},
                    blockGroupType: 'FormatContainer',
                    blocks: [
                        {
                            formatHolder: {
                                isSelected: false,
                                segmentType: 'SelectionMarker',
                                format: {},
                            },
                            levels: [{ listType: 'OL', format: {}, dataset: {} }],
                            blockType: 'BlockGroup',
                            format: {},
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    segments: [
                                        {
                                            text: 'test',
                                            segmentType: 'Text',
                                            isSelected: true,
                                            format: {},
                                        },
                                    ],
                                    blockType: 'Paragraph',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toEqual('clearFormat');
                callback(model, { newEntities: [], deletedEntities: [], newImages: [] });
            });
        const editor = ({
            focus: () => {},
            formatContentModel: formatContentModelSpy,
        } as any) as IEditor;

        clearFormat(editor);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    segments: [
                        {
                            text: 'test',
                            segmentType: 'Text',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    blockType: 'Paragraph',
                    format: {},
                },
            ],
        });
    });
});
