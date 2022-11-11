import * as validate from 'roosterjs-editor-dom/lib/metadata/validate';
import { ContentModelWithDataset } from '../../../lib/publicTypes/format/ContentModelWithDataset';
import { Definition } from 'roosterjs-editor-types';
import { hasMetadata, updateMetadata } from '../../../lib/modelApi/metadata/updateMetadata';

describe('updateMetadata', () => {
    it('no metadata', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {},
        };
        const callback = jasmine.createSpy('callback');

        updateMetadata(model, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(model).toEqual({
            dataset: {},
        });
    });

    it('with metadata, no change', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(obj => obj);

        updateMetadata(model, callback);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(model).toEqual({
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        });
    });

    it('with metadata, change the value', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(() => ({ c: 'd' }));

        updateMetadata(model, callback);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(model).toEqual({
            dataset: {
                editingInfo: '{"c":"d"}',
            },
        });
    });

    it('with metadata, delete metadata', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(() => null);

        updateMetadata(model, callback);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(model).toEqual({
            dataset: {},
        });
    });

    it('with metadata, pass the validation', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(() => null);

        spyOn(validate, 'default').and.returnValue(true);

        updateMetadata(model, callback, {} as Definition<void>);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(model).toEqual({
            dataset: {},
        });
    });

    it('with metadata, fail the validation, return new value', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(() => ({ c: 'd' }));

        function fakeValidation<T>(input: any): input is T {
            return !!input.c;
        }

        spyOn(validate, 'default').and.callFake(fakeValidation);

        updateMetadata(model, callback, {} as Definition<void>);

        expect(callback).toHaveBeenCalledWith(null);
        expect(model).toEqual({
            dataset: {
                editingInfo: '{"c":"d"}',
            },
        });
    });

    it('with metadata, pass the input validation, fail the output validation', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(() => ({ c: 'd' }));

        function fakeValidation<T>(input: any): input is T {
            return !!input.a;
        }

        spyOn(validate, 'default').and.callFake(fakeValidation);

        updateMetadata(model, callback, {} as Definition<void>);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(model).toEqual({
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        });
    });
});

describe('hasMetadata', () => {
    it('no metadata', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {},
        };

        const result = hasMetadata(model);

        expect(result).toBeFalse();
    });

    it('empty metadata', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '',
            },
        };

        const result = hasMetadata(model);

        expect(result).toBeFalse();
    });

    it('valid metadata', () => {
        const model: ContentModelWithDataset<void> = {
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        };

        const result = hasMetadata(model);

        expect(result).toBeTrue();
    });
});
