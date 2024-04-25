// import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
// import { ImageMetadataFormat, ImageRotateMetadataFormat } from 'roosterjs-content-model-types';
// import { Rotator } from '../../../lib/imageEdit/Rotator/rotatorContext';
// import {
//     DNDDirectionX,
//     DnDDirectionY,
//     DragAndDropContext,
// } from '../../../lib/imageEdit/types/DragAndDropContext';

// const ROTATE_SIZE = 32;
// const ROTATE_GAP = 15;
// const DEG_PER_RAD = 180 / Math.PI;
// const DEFAULT_ROTATE_HANDLE_HEIGHT = ROTATE_SIZE / 2 + ROTATE_GAP;

// describe('Rotate: rotate only', () => {
//     const options: ImageEditOptions = {
//         minRotateDeg: 10,
//     };

//     const initValue: ImageRotateMetadataFormat = { angleRad: 0 };
//     const mouseEvent: MouseEvent = {} as any;
//     const mouseEventAltKey: MouseEvent = { altkey: true } as any;
//     const Xs: DNDDirectionX[] = ['w', '', 'e'];
//     const Ys: DnDDirectionY[] = ['n', '', 's'];

//     function getInitEditInfo(): ImageMetadataFormat {
//         return {
//             src: '',
//             naturalWidth: 100,
//             naturalHeight: 200,
//             leftPercent: 0,
//             topPercent: 0,
//             rightPercent: 0,
//             bottomPercent: 0,
//             widthPx: 100,
//             heightPx: 200,
//             angleRad: 0,
//         };
//     }

//     function runTest(
//         e: MouseEvent,
//         getEditInfo: () => ImageMetadataFormat,
//         expectedResult: number
//     ) {
//         let angle = 0;
//         Xs.forEach(x => {
//             Ys.forEach(y => {
//                 const editInfo = getEditInfo();
//                 const context: DragAndDropContext = {
//                     elementClass: <any>'',
//                     x,
//                     y,
//                     editInfo,
//                     options,
//                 };
//                 Rotator.onDragging?.(context, e, initValue, 20, 20);
//                 angle = editInfo.angleRad || 0;
//             });
//         });

//         expect(angle).toEqual(expectedResult);
//     }

//     it('Rotate alt key', () => {
//         runTest(
//             mouseEventAltKey,
//             () => {
//                 const editInfo = getInitEditInfo();
//                 editInfo.heightPx = 100;
//                 return editInfo;
//             },
//             calculateAngle(100, mouseEventAltKey)
//         );
//     });

//     it('Rotate no alt key', () => {
//         runTest(
//             mouseEvent,
//             () => {
//                 const editInfo = getInitEditInfo();
//                 editInfo.heightPx = 180;
//                 return editInfo;
//             },
//             calculateAngle(180, mouseEvent)
//         );
//     });
// });

// function calculateAngle(heightPx: number, mouseInfo: MouseEvent) {
//     const distance = heightPx / 2 + DEFAULT_ROTATE_HANDLE_HEIGHT;
//     const newX = distance * Math.sin(0) + 20;
//     const newY = distance * Math.cos(0) - 20;
//     let angleInRad = Math.atan2(newX, newY);

//     if (!mouseInfo.altKey) {
//         const angleInDeg = angleInRad * DEG_PER_RAD;
//         const adjustedAngleInDeg = Math.round(angleInDeg / 10) * 10;
//         angleInRad = adjustedAngleInDeg / DEG_PER_RAD;
//     }

//     return angleInRad;
// }
