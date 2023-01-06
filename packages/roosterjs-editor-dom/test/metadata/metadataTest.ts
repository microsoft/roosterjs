import { CustomizeDefinition, DefinitionType } from 'roosterjs-editor-types';
import { encode64 } from '../DomTestHelper';
import { getMetadata, removeMetadata, setMetadata } from '../../lib/metadata/metadata';

describe('metadata', () => {
    it('getMetadata gets a valid metadata', () => {
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };
        const obj = { x: 1, y: 'test' };
        const validatorSpy = spyOn(validators, 'trueValidator').and.callThrough();
        const div = document.createElement('div');
        div.innerHTML = '<span>test</span>';
        const node = div.firstChild as HTMLElement;
        const encodedMetadata = encode64(JSON.stringify(obj));
        node.setAttribute('data-editing-info', encodedMetadata);
        const def: CustomizeDefinition = {
            type: DefinitionType.Customize,
            validator: validators.trueValidator,
        };

        const metadata = getMetadata(node, def);

        expect(validatorSpy).toHaveBeenCalled();
        expect(metadata).toEqual(obj);
    });

    it('getMetadata gets an invalid metadata', () => {
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };
        const obj = { x: 1, y: 'test' };
        const validatorSpy = spyOn(validators, 'falseValidator').and.callThrough();
        const div = document.createElement('div');
        div.innerHTML = '<span>test</span>';
        const node = div.firstChild as HTMLElement;
        const encodedMetadata = encode64(JSON.stringify(obj));
        node.setAttribute('data-editing-info', encodedMetadata);

        const def: CustomizeDefinition = {
            type: DefinitionType.Customize,
            validator: validators.falseValidator,
        };

        const metadata = getMetadata(node, def);

        expect(validatorSpy).toHaveBeenCalled();
        expect(metadata).toBeNull();
    });

    it('getMetadata gets an invalid metadata and return default value', () => {
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };
        const obj = { x: 1, y: 'test' };
        const validatorSpy = spyOn(validators, 'falseValidator').and.callThrough();
        const div = document.createElement('div');
        div.innerHTML = '<span>test</span>';
        const node = div.firstChild as HTMLElement;

        const encodedMetadata = encode64(JSON.stringify(obj));
        node.setAttribute('data-editing-info', encodedMetadata);

        const def: CustomizeDefinition = {
            type: DefinitionType.Customize,
            validator: validators.falseValidator,
        };

        const metadata = getMetadata(node, def, obj);

        expect(validatorSpy).toHaveBeenCalled();
        expect(metadata).toBe(obj);
    });

    it('setMetadata sets a valid metadata', () => {
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };
        const obj = { x: 1, y: 'test' };
        const validatorSpy = spyOn(validators, 'trueValidator').and.callThrough();
        const node = document.createElement('div');
        const def: CustomizeDefinition = {
            type: DefinitionType.Customize,
            validator: validators.trueValidator,
        };
        const result = setMetadata(node, obj, def);
        const editingInfo = encode64(JSON.stringify(obj));
        expect(validatorSpy).toHaveBeenCalled();
        expect(result).toBeTrue();
        expect(node.outerHTML).toBe(`<div data-editing-info="&quot;${editingInfo}&quot;"></div>`);
    });

    it('setMetadata sets an invalid metadata', () => {
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };
        const validatorSpy = spyOn(validators, 'falseValidator').and.callThrough();
        const node = document.createElement('div');
        const def: CustomizeDefinition = {
            type: DefinitionType.Customize,
            validator: validators.falseValidator,
        };
        const obj = { x: 1, y: 'test' };
        const result = setMetadata(node, obj, def);

        expect(validatorSpy).toHaveBeenCalled();
        expect(result).toBeFalse();
        expect(node.outerHTML).toBe('<div></div>');
    });
});

describe('removeMetadata', () => {
    it('removeElement', () => {
        const obj = { x: 1, y: 'test' };
        const div = document.createElement('div');
        div.setAttribute('data-editing-info', JSON.stringify(obj));
        removeMetadata(div);
        expect(div.outerHTML).toBe('<div></div>');
    });
});
