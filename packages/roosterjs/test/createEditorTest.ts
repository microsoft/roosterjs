import * as roosterjs from '../lib/index';
// Include from root to make sure all files are included and covered by code coverage tool

describe('createEditor', () => {
    it('Create editor with null inpout', () => {
        expect(() => {
            roosterjs.createEditor(null);
        }).toThrow();
    });

    it('Create editor with non-DIV inpout', () => {
        expect(() => {
            const span = document.createElement('span');
            roosterjs.createEditor(span as any);
        }).toThrow();
    });

    it('Create an editor', () => {
        const div = document.createElement('div');
        const editor = roosterjs.createEditor(div);
        expect(editor).not.toBeNull();
    });

    it('Create an editor with additional plugins', () => {
        const div = document.createElement('div');
        const initialize = jasmine.createSpy('initialize');
        const dispose = jasmine.createSpy('dispose');
        const onPluginEvent = jasmine.createSpy('onPluginEvent');
        const editor = roosterjs.createEditor(div, [
            {
                getName: () => 'test',
                initialize,
                dispose,
                onPluginEvent,
            },
        ]);
        expect(editor).not.toBeNull();
        expect(initialize).toHaveBeenCalledWith(editor);
        expect(dispose).not.toHaveBeenCalled();
        expect(onPluginEvent).toHaveBeenCalledWith({
            eventType: roosterjs.PluginEventType.EditorReady,
        });

        editor.dispose();
        expect(dispose).toHaveBeenCalled();
        expect(onPluginEvent).toHaveBeenCalledWith({
            eventType: roosterjs.PluginEventType.BeforeDispose,
        });
    });

    it('Create an editor with initial content', () => {
        const div = document.createElement('div');
        const initContent = '<b>this is a test</b>';
        const editor = roosterjs.createEditor(div, [], initContent);
        expect(editor).not.toBeNull();
        expect(div.innerHTML).toBe('<div><b>this is a test</b></div>');

        editor.dispose();
    });
});
