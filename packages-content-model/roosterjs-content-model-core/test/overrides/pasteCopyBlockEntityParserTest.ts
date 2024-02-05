import * as entityUtilsFile from 'roosterjs-content-model-dom/lib/domUtils/entityUtils';
import { ContentModelEntity } from 'roosterjs-content-model-types';
import {
    onCreateCopyEntityNode,
    pasteBlockEntityParser,
} from '../../lib/override/pasteCopyBlockEntityParser';

describe('onCreateCopyEntityNode', () => {
    it('handle', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.style.width = '100%';
        span.style.display = 'inline-block';
        div.appendChild(span);
        const modelEntity: ContentModelEntity = {
            entityFormat: {},
            format: {},
            wrapper: div,
            segmentType: 'Entity',
            blockType: 'Entity',
        };

        onCreateCopyEntityNode(modelEntity, div);

        expect(span.style.display).toEqual('inline-block');
        expect(div.classList.contains('_EBlock')).toBeTrue();
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
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);
        div.classList.add('_EBlock');
        span.classList.add('_Entity');
        spyOn(entityUtilsFile, 'addDelimiters');

        pasteBlockEntityParser({}, div, <any>{}, {});

        expect(span.style.width).toEqual('100%');
        expect(span.style.display).toEqual('inline-block');
        expect(div.classList.contains('_EBlock')).toBeFalse();
        expect(entityUtilsFile.addDelimiters).toHaveBeenCalled();
    });

    it('Dont handle', () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.appendChild(span);

        pasteBlockEntityParser({}, div, <any>{}, {});

        expect(span.style.width).not.toEqual('100%');
        expect(span.style.display).not.toEqual('inline-block');
        expect(span.classList.contains('_EBlock')).toBeFalse();
    });
});
