import svgToMiniDataURI from 'mini-svg-data-uri';
import { useEffect, useState } from 'react';

export default function WifiIcon2(stroke: string, size: number): string {
  const [imgString, setImgString] = useState('');

  useEffect(() => {
    const creatImg = async () => {
      try {
        const wifi2 = `
  <svg
      id="wifi2-svg-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56.02"
  >
  <path d="m8.07,39.87c4.46,0,8.07,3.61,8.07,8.07s-3.61,8.07-8.07,8.07S0,52.4,0,47.94s3.61-8.07,8.07-8.07h0Z" fill="${stroke}" />
  <path d="m29.9,50.77c0-13.89-11.26-25.15-25.15-25.15-5.45.16-7.16-7.69,0-7.94,18.28,0,33.1,14.82,33.1,33.1.28,6.34-8.16,6.55-7.94,0h0Z" fill="${stroke}" fillRule="evenodd"/>
  <path d="m5.24.02C33.27.02,56,22.74,56,50.77c.19,5.54-7.63,6.49-7.94,0C48.05,27.13,28.89,7.96,5.24,7.96-2.23,7.68-1.25-.42,5.24.02h0Z" fill="${stroke}" fillRule="evenodd"/></svg>
  `;
        /*
         * Keep the arrow canvas up to date
         */
        const canvas = document.createElement('canvas');
        canvas.height = size + 15;
        canvas.width = size;
        const context = canvas?.getContext('2d');
        if (context) {
          const im = new Image();
          im.src = svgToMiniDataURI(wifi2);
          im.onload = () => {
            console.log('wifi2 updated', size);
            context.drawImage(im, 0, 10, size, size);
            setImgString(canvas.toDataURL());
          };
        }
      } catch (e) {
        console.log('wifi2 error', e);
      }
    };
    creatImg();
  }, [size, stroke]);

  return imgString;
}
