import { useState, useEffect } from 'react';
import thrive from '../../assets/images/ThriveCode.png';

export default function QRCodeImage(size: number): string {
  const [imgString, setImgString] = useState('');

  useEffect(() => {
    const creatImg = async () => {
      try {
        /*
         * Keep the QRCode canvas up to date
         */
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.height = size;
        canvas.width = size;
        const context: CanvasRenderingContext2D | null =
          canvas.getContext('2d');
        if (context) {
          const im = new Image();
          im.src = thrive;
          im.onload = () => {
            console.log('QR Image updated', size);
            context.drawImage(im, 2, 2, size, size);
            setImgString(canvas.toDataURL());
          };
        }
      } catch (e) {
        console.log('wifi error', e);
      }
    };
    creatImg();
  }, [size]);

  return imgString;
}
