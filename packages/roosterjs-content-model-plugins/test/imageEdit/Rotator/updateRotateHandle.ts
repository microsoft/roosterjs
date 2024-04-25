// import * as TestHelper from '../../TestHelper';
// import { createElement } from '../../../lib/pluginUtils/CreateElement/createElement';
// import { getRotateHTML } from '../../../lib/imageEdit/Rotator/createImageRotator';
// import { IEditor, Rect } from 'roosterjs-content-model-types';
// import { ImageEditPlugin } from '../../../lib/imageEdit/ImageEditPlugin';
// import { ImageHtmlOptions } from '../../../lib/imageEdit/types/ImageHtmlOptions';
// import { insertImage } from '../../../../roosterjs-content-model-api/lib';
// import { updateRotateHandle } from '../../../lib/imageEdit/Rotator/updateRotateHandle';

// const DEG_PER_RAD = 180 / Math.PI;

// describe('updateRotateHandlePosition', () => {
//     let editor: IEditor;
//     const TEST_ID = 'imageEditTest_rotateHandlePosition';
//     let plugin: ImageEditPlugin;
//     let editorGetVisibleViewport: any;
//     beforeEach(() => {
//         plugin = new ImageEditPlugin();
//         editor = TestHelper.initEditor(TEST_ID, [plugin]);
//         editorGetVisibleViewport = spyOn(editor, 'getVisibleViewport');
//     });

//     afterEach(() => {
//         let element = document.getElementById(TEST_ID);
//         if (element) {
//             element.parentElement.removeChild(element);
//         }
//         editor.dispose();
//     });
//     const options: ImageHtmlOptions = {
//         borderColor: 'blue',
//         rotateHandleBackColor: 'blue',
//         isSmallImage: false,
//     };

//     function runTest(
//         rotatePosition: DOMRect,
//         rotateCenterTop: string,
//         rotateCenterHeight: string,
//         rotateHandleTop: string,
//         wrapperPosition: DOMRect,
//         angle: number
//     ) {
//         insertImage(editor, 'test');
//         const selection = editor.getDOMSelection();
//         if (selection?.type !== 'image') {
//             return;
//         }
//         const image = selection.image;
//         plugin.startRotateAndResize(editor, image, 'rotate');
//         const rotate = getRotateHTML(options)[0];
//         const rotateHTML = createElement(rotate, document);
//         const imageParent = image.parentElement;
//         imageParent!.appendChild(rotateHTML!);
//         const wrapper = imageParent?.parentElement as HTMLElement;
//         const rotateCenter = document.getElementsByClassName('r_rotateC')[0] as HTMLElement;
//         const rotateHandle = document.getElementsByClassName('r_rotateH')[0] as HTMLElement;
//         spyOn(rotateHandle, 'getBoundingClientRect').and.returnValues(rotatePosition);
//         spyOn(wrapper, 'getBoundingClientRect').and.returnValues(wrapperPosition);
//         const viewport: Rect = {
//             top: 1,
//             bottom: 200,
//             left: 1,
//             right: 200,
//         };
//         editorGetVisibleViewport.and.returnValue(viewport);
//         const angleRad = angle / DEG_PER_RAD;

//         updateRotateHandle(viewport, angleRad, wrapper, rotateCenter, rotateHandle, false);

//         expect(rotateCenter.style.top).toBe(rotateCenterTop);
//         expect(rotateCenter.style.height).toBe(rotateCenterHeight);
//         expect(rotateHandle.style.top).toBe(rotateHandleTop);
//     }

//     it('adjust rotate handle - ROTATOR HIDDEN ON TOP', () => {
//         runTest(
//             {
//                 top: 0,
//                 bottom: 3,
//                 left: 3,
//                 right: 5,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             '-6px',
//             '0px',
//             '0px',
//             {
//                 top: 2,
//                 bottom: 3,
//                 left: 2,
//                 right: 5,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             0
//         );
//     });

//     it('adjust rotate handle - ROTATOR NOT HIDDEN', () => {
//         runTest(
//             {
//                 top: 2,
//                 bottom: 3,
//                 left: 3,
//                 right: 5,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             '-21px',
//             '15px',
//             '-32px',
//             {
//                 top: 0,
//                 bottom: 20,
//                 left: 3,
//                 right: 5,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             50
//         );
//     });

//     it('adjust rotate handle - ROTATOR HIDDEN ON LEFT', () => {
//         runTest(
//             {
//                 top: 2,
//                 bottom: 3,
//                 left: 2,
//                 right: 5,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             '-6px',
//             '0px',
//             '0px',
//             {
//                 top: 2,
//                 bottom: 3,
//                 left: 2,
//                 right: 5,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             -90
//         );
//     });

//     it('adjust rotate handle - ROTATOR HIDDEN ON BOTTOM', () => {
//         runTest(
//             {
//                 top: 2,
//                 bottom: 200,
//                 left: 1,
//                 right: 5,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             '-6px',
//             '0px',
//             '0px',
//             {
//                 top: 0,
//                 bottom: 190,
//                 left: 3,
//                 right: 190,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             180
//         );
//     });

//     it('adjust rotate handle - ROTATOR HIDDEN ON RIGHT', () => {
//         runTest(
//             {
//                 top: 2,
//                 bottom: 3,
//                 left: 1,
//                 right: 200,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             '-6px',
//             '0px',
//             '0px',
//             {
//                 top: 0,
//                 bottom: 190,
//                 left: 3,
//                 right: 190,
//                 height: 2,
//                 width: 2,
//                 x: 1,
//                 y: 3,
//                 toJSON: () => {},
//             },
//             90
//         );
//     });
// });
