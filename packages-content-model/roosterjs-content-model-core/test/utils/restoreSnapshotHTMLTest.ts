import { restoreSnapshotHTML } from '../../lib/utils/restoreSnapshotHTML';
import { Snapshot, StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('restoreSnapshotHTML', () => {
    let core: StandaloneEditorCore;
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');

        core = {
            contentDiv: div,
            entity: {
                entityMap: {},
            },
        } as any;
    });

    it('Empty HTML', () => {
        const snapshot: Snapshot = {
            html: '',
        } as any;

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('');
    });

    it('Simple HTML, no entity', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div><br></div><div>test2</div>',
        } as any;

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div>test1</div><div><br></div><div>test2</div>');
    });

    it('Simple HTML, no entity, with trustHTMLHandler', () => {
        const trustedHTMLHandler = jasmine
            .createSpy('trustedHTMLHandler')
            .and.callFake((html: string) => html + html);
        const snapshot: Snapshot = {
            html: '<div>test1</div>',
        } as any;

        (<any>core).trustedHTMLHandler = trustedHTMLHandler;

        restoreSnapshotHTML(core, snapshot);

        expect(trustedHTMLHandler).toHaveBeenCalledWith('<div>test1</div>');
        expect(div.innerHTML).toBe('<div>test1</div><div>test1</div>');
    });

    it('HTML with block entity at root level, cannot match', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');

        entityWrapper.id = 'div2';
        core.entity.entityMap.C = {
            element: entityWrapper,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>'
        );
    });

    it('HTML with block entity at root level, can match', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');

        entityWrapper.id = 'div2';
        core.entity.entityMap.B = {
            element: entityWrapper,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div>test1</div><div id="div2"></div><div>test2</div>');
        expect(div.childNodes[1]).toBe(entityWrapper);
    });

    it('HTML with block entity at root level, entity is already in editor', () => {
        const snapshot: Snapshot = {
            html: '<div>test1</div><div class="_Entity _EType_A _EId_B"><br></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper);
        div.appendChild(document.createTextNode('test2'));

        entityWrapper.id = 'div2';
        core.entity.entityMap.B = {
            element: entityWrapper,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div>test1</div><div id="div2"></div><div>test2</div>');
        expect(div.childNodes[1]).toBe(entityWrapper);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in original DOM', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the same order, continuous in snapshot', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in original DOM', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div>test2</div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div>test2</div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[3]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in snapshot', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(document.createTextNode('test2'));
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div><div>test3</div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(document.createTextNode('test1'));
        div.appendChild(entityWrapper2);
        div.appendChild(entityWrapper1);
        div.appendChild(document.createTextNode('test3'));

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div id="divA"></div><div id="divB"></div><div>test3</div>'
        );
        expect(div.childNodes[1]).toBe(entityWrapper1);
        expect(div.childNodes[2]).toBe(entityWrapper2);
    });

    it('HTML with double block entity at root level, entity is already in editor in the reverse order, continuous in both, no other nodes', () => {
        const snapshot: Snapshot = {
            html:
                '<div class="_Entity _EType_A _EId_B1"><br></div><div class="_Entity _EType_A _EId_B2"><br></div>',
        } as any;

        const entityWrapper1 = document.createElement('DIV');
        const entityWrapper2 = document.createElement('DIV');

        div.appendChild(entityWrapper2);
        div.appendChild(entityWrapper1);

        entityWrapper1.id = 'divA';
        entityWrapper2.id = 'divB';

        core.entity.entityMap.B1 = {
            element: entityWrapper1,
        };
        core.entity.entityMap.B2 = {
            element: entityWrapper2,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe('<div id="divA"></div><div id="divB"></div>');
        expect(div.childNodes[0]).toBe(entityWrapper1);
        expect(div.childNodes[1]).toBe(entityWrapper2);
    });

    it('HTML with inline entities', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div><span class="_Entity _EType_A _EId_B1"><br></span></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('span');

        entityWrapper.id = 'spanA';

        core.entity.entityMap.B1 = {
            element: entityWrapper,
        };

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div><span id="spanA"></span></div><div>test2</div>'
        );
        expect(div.childNodes[1].firstChild).toBe(entityWrapper);
    });

    it('HTML with inline entities, original entity node is in editor', () => {
        const snapshot: Snapshot = {
            html:
                '<div>test1</div><div><span class="_Entity _EType_A _EId_B1"><br></span></div><div>test2</div>',
        } as any;

        const entityWrapper = document.createElement('span');

        entityWrapper.id = 'spanA';

        core.entity.entityMap.B1 = {
            element: entityWrapper,
        };

        div.appendChild(entityWrapper);

        restoreSnapshotHTML(core, snapshot);

        expect(div.innerHTML).toBe(
            '<div>test1</div><div><span id="spanA"></span></div><div>test2</div>'
        );
        expect(div.childNodes[1].firstChild).toBe(entityWrapper);
    });
});
