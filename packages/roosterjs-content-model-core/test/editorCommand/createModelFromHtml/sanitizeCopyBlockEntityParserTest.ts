import * as entityUtilsFile from 'roosterjs-content-model-dom/lib/domUtils/entityUtils';
import { ContentModelEntity } from 'roosterjs-content-model-types';
import {
    onCreateCopyEntityNode,
    sanitizeCopyBlockEntityParser,
} from '../../../lib/editorCommand/createModelFromHtml/sanitizeCopyBlockEntityParser';

describe('onCreateCopyEntityNode', () => {
    it('handle', () => {
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.display = 'inline-block';
        const modelEntity: ContentModelEntity = {
            entityFormat: {},
            format: {},
            wrapper: div,
            segmentType: 'Entity',
            blockType: 'Entity',
        };

        onCreateCopyEntityNode(modelEntity, div);

        expect(div.style.display).toEqual('block');
        expect(div.style.width).toEqual('');
        expect(div.classList.contains('_EBlock')).toBeTrue();
    });

    it('Dont handle, no 100% width', () => {
        const div = document.createElement('div');
        div.style.display = 'inline-block';
        const modelEntity: ContentModelEntity = {
            entityFormat: {},
            format: {},
            wrapper: div,
            segmentType: 'Entity',
            blockType: 'Entity',
        };

        onCreateCopyEntityNode(modelEntity, div);

        expect(div.style.display).not.toEqual('block');
        expect(div.classList.contains('_EBlock')).not.toBeTrue();
    });

    it('Dont handle, not inline block', () => {
        const div = document.createElement('div');
        div.style.width = '100%';
        const modelEntity: ContentModelEntity = {
            entityFormat: {},
            format: {},
            wrapper: div,
            segmentType: 'Entity',
            blockType: 'Entity',
        };

        onCreateCopyEntityNode(modelEntity, div);

        expect(div.style.display).not.toEqual('block');
        expect(div.classList.contains('_EBlock')).not.toBeTrue();
    });
});

describe('pasteBlockEntityParser', () => {
    it('handle', () => {
        const div = document.createElement('div');
        div.classList.add('_EBlock');
        spyOn(entityUtilsFile, 'addDelimiters');

        sanitizeCopyBlockEntityParser({}, div, <any>{}, {});

        expect(div.style.width).toEqual('100%');
        expect(div.style.display).toEqual('inline-block');
        expect(div.classList.contains('_EBlock')).toBeFalse();
    });

    it('Dont handle', () => {
        const div = document.createElement('div');

        sanitizeCopyBlockEntityParser({}, div, <any>{}, {});

        expect(div.style.width).not.toEqual('100%');
        expect(div.style.display).not.toEqual('inline-block');
        expect(div.classList.contains('_EBlock')).toBeFalse();
    });
});
