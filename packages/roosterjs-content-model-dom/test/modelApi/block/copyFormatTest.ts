import { ContentModelBlockFormat } from 'roosterjs-content-model-types';
import {
    copyFormat,
    ListFormatsToKeep,
    ListFormatsToMove,
    ParagraphFormats,
} from '../../../lib/modelApi/block/copyFormat';

describe('copyFormat', () => {
    it('empty format', () => {
        const targetFormat = {};
        const sourceFormat = {};

        copyFormat<ContentModelBlockFormat>(targetFormat, sourceFormat, []);

        expect(targetFormat).toEqual({});
    });

    it('has format, no keys', () => {
        const targetFormat: ContentModelBlockFormat = {};
        const sourceFormat: ContentModelBlockFormat = {
            backgroundColor: 'blue',
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
            lineHeight: '2',
            textIndent: '10',
            marginTop: '10',
            marginRight: '10',
            marginBottom: '10',
            marginLeft: '10',
            paddingTop: '10',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
        };

        copyFormat<ContentModelBlockFormat>(targetFormat, sourceFormat, []);

        expect(targetFormat).toEqual(targetFormat);
    });

    it('copy list format, keep source', () => {
        const targetFormat: ContentModelBlockFormat = {};
        const sourceFormat: ContentModelBlockFormat = {
            backgroundColor: 'blue',
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
            lineHeight: '2',
            textIndent: '10',
            marginTop: '10',
            marginRight: '10',
            marginBottom: '10',
            marginLeft: '10',
            paddingTop: '10',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
        };

        copyFormat<ContentModelBlockFormat>(targetFormat, sourceFormat, ListFormatsToKeep, false);

        expect(targetFormat).toEqual({
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
        });

        expect(sourceFormat).toEqual({
            backgroundColor: 'blue',
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
            lineHeight: '2',
            textIndent: '10',
            marginTop: '10',
            marginRight: '10',
            marginBottom: '10',
            marginLeft: '10',
            paddingTop: '10',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
        });
    });

    it('copy list format, remove source', () => {
        const targetFormat: ContentModelBlockFormat = {};
        const sourceFormat: ContentModelBlockFormat = {
            backgroundColor: 'blue',
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
            lineHeight: '2',
            textIndent: '10',
            marginTop: '10',
            marginRight: '10',
            marginBottom: '10',
            marginLeft: '10',
            paddingTop: '10',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
        };
        copyFormat<ContentModelBlockFormat>(targetFormat, sourceFormat, ListFormatsToMove, true);
        expect(targetFormat).toEqual({
            marginRight: '10',
            marginLeft: '10',
            paddingRight: '10',
            paddingLeft: '10',
        });
        expect(sourceFormat).toEqual({
            backgroundColor: 'blue',
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
            lineHeight: '2',
            textIndent: '10',
            marginTop: '10',
            marginBottom: '10',
            paddingTop: '10',
            paddingBottom: '10',
        });
    });

    it('copy paragraph format', () => {
        const targetFormat: ContentModelBlockFormat = {};
        const sourceFormat: ContentModelBlockFormat = {
            backgroundColor: 'blue',
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
            lineHeight: '2',
            textIndent: '10',
            marginTop: '10',
            marginRight: '10',
            marginBottom: '10',
            marginLeft: '10',
            paddingTop: '10',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
        };

        copyFormat<ContentModelBlockFormat>(targetFormat, sourceFormat, ParagraphFormats);

        expect(targetFormat).toEqual({
            backgroundColor: 'blue',
            direction: 'rtl',
            textAlign: 'end',
            htmlAlign: 'end',
            lineHeight: '2',
            textIndent: '10',
            marginTop: '10',
            marginRight: '10',
            marginBottom: '10',
            marginLeft: '10',
            paddingTop: '10',
            paddingRight: '10',
            paddingBottom: '10',
            paddingLeft: '10',
        });

        expect(sourceFormat).toEqual(targetFormat);
    });
});
