import { ContentModelEntity } from 'roosterjs-content-model-types';
import {
    onCreateCopyEntityNode,
    pasteBlockEntityParser,
} from '../../lib/override/pasteCopyBlockEntityParser';

describe('onCreateCopyEntityNode', () => {
    it('handle', () => {
        const span = document.createElement('span');
        span.style.width = '100%';
        span.style.display = 'inline-block';
        const modelEntity: ContentModelEntity = {
            entityFormat: {},
            format: {},
            wrapper: span,
            segmentType: 'Entity',
            blockType: 'Entity',
        };

        onCreateCopyEntityNode(modelEntity, span);

        expect(span.style.display).toEqual('block');
        expect(span.classList.contains('_EBlock')).toBeTrue();
    });

    it('Dont handle, no 100% width', () => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        const modelEntity: ContentModelEntity = {
            entityFormat: {},
            format: {},
            wrapper: span,
            segmentType: 'Entity',
            blockType: 'Entity',
        };

        onCreateCopyEntityNode(modelEntity, span);

        expect(span.style.display).not.toEqual('block');
        expect(span.classList.contains('_EBlock')).not.toBeTrue();
    });

    it('Dont handle, not inline block', () => {
        const span = document.createElement('span');
        span.style.width = '100%';
        const modelEntity: ContentModelEntity = {
            entityFormat: {},
            format: {},
            wrapper: span,
            segmentType: 'Entity',
            blockType: 'Entity',
        };

        onCreateCopyEntityNode(modelEntity, span);

        expect(span.style.display).not.toEqual('block');
        expect(span.classList.contains('_EBlock')).not.toBeTrue();
    });
});

describe('pasteBlockEntityParser', () => {
    it('handle', () => {
        const span = document.createElement('span');
        span.classList.add('_EBlock');

        pasteBlockEntityParser({}, span, <any>{}, {});

        expect(span.style.width).toEqual('100%');
        expect(span.style.display).toEqual('inline-block');
        expect(span.classList.contains('_EBlock')).toBeFalse();
    });

    it('Dont handle', () => {
        const span = document.createElement('span');

        pasteBlockEntityParser({}, span, <any>{}, {});

        expect(span.style.width).not.toEqual('100%');
        expect(span.style.display).not.toEqual('inline-block');
        expect(span.classList.contains('_EBlock')).toBeFalse();
    });
});
