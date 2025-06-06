import { ContentModelSegmentFormat, EditorEnvironment } from 'roosterjs-content-model-types';
import { createDomToModelConfig } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomConfig } from '../../../lib/modelToDom/context/createModelToDomContext';
import { normalizeSegmentFormat } from '../../../lib/modelApi/common/normalizeSegmentFormat';

describe('normalizeSegmentFormat', () => {
    let environment: EditorEnvironment;

    beforeEach(() => {
        environment = {
            domToModelSettings: {
                calculated: createDomToModelConfig([]),
            },
            modelToDomSettings: {
                calculated: createModelToDomConfig([]),
            },
        } as EditorEnvironment;
    });

    it('empty format', () => {
        const format: ContentModelSegmentFormat = {};

        const result = normalizeSegmentFormat(format, environment);

        expect(result).toEqual({});
    });

    it('Basic format', () => {
        const format: ContentModelSegmentFormat = {
            fontFamily: 'Font1',
            fontSize: '20px',
            textColor: 'red',
        };

        const result = normalizeSegmentFormat(format, environment);

        expect(result).toEqual({
            fontFamily: 'Font1',
            fontSize: '20px',
            textColor: 'red',
        });
    });

    it('Format needs to be normalized', () => {
        const format: ContentModelSegmentFormat = {
            fontFamily: 'Font1,Font2,"Font 3"',
            fontSize: '20pt',
            textColor: '#123456',
            backgroundColor: '#654321',
        };

        const result = normalizeSegmentFormat(format, environment);

        expect(result).toEqual({
            fontFamily: 'Font1, Font2, "Font 3"',
            fontSize: '20pt',
            textColor: 'rgb(18, 52, 86)',
            backgroundColor: 'rgb(101, 67, 33)',
        });
    });

    it('Structured format', () => {
        const format: ContentModelSegmentFormat = {
            fontWeight: 'bold',
            italic: true,
            underline: true,
            letterSpacing: '2px',
        };

        const result = normalizeSegmentFormat(format, environment);

        expect(result).toEqual({
            letterSpacing: '2px',
            fontWeight: 'bold',
            italic: true,
            underline: true,
        });
    });
});
