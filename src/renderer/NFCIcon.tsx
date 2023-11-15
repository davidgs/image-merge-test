import svgToMiniDataURI from 'mini-svg-data-uri';
import { useEffect, useMemo, useState } from 'react';

export default function NFCIcon(
  fill: string,
  stroke: string,
  size: number,
): HTMLCanvasElement {
  // const ref = useRef();
  const [svgEle, setSvgEle] = useState('');

  useEffect(() => {
  // const svg: string = useMemo(() => {
    setSvgEle(`<svg
      id="nfc-svg-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="180"
      height="170"
      viewBox="0 0 18.73 16.42"
    >
      <circle
        strokeWidth=".77px"
        fill="${fill}"
        stroke="${stroke}"
        cx="8.21"
        cy="8.21"
        r="7.83"
      />
      <path
        fill="${stroke}"
        d="m4.84,9.59c-.17.13-.19.38-.06.54.13.17.38.19.54.06.59-.48.92-1.18.9-1.94-.02-.71-.34-1.37-.89-1.82-.07-.06-.16-.09-.25-.09-.11,0-.21.05-.29.14-.13.16-.11.41.05.54.37.31.6.76.61,1.24.01.52-.21,1-.62,1.32Z"
      />
      <path
        fill="${stroke}"
        d="m6.91,8.27c0,.8-.31,1.55-.86,2.13-.15.15-.14.4,0,.54.15.15.4.14.54,0,.69-.72,1.08-1.66,1.08-2.66,0-1-.38-1.95-1.08-2.68-.08-.08-.18-.12-.28-.12-.1,0-.19.04-.27.11-.15.15-.16.39,0,.54.56.58.87,1.34.86,2.14Z"
      />
      <path
        fill="${stroke}"
        d="m8.45,8.27c-.01,1.1-.42,2.17-1.14,3.01-.14.16-.12.4.04.54.16.14.4.12.54-.04.84-.97,1.31-2.21,1.33-3.5.02-1.34-.46-2.64-1.34-3.65-.07-.09-.18-.13-.28-.13-.09,0-.18.03-.26.09-.16.14-.18.38-.04.54.76.87,1.17,1.98,1.15,3.14Z"
      />
      <path
        fill="${stroke}"
        d="m9.95,8.29c-.03,1.43-.53,2.77-1.44,3.88-.13.16-.11.41.05.54.16.14.41.11.54-.05,1.02-1.24,1.58-2.74,1.61-4.35.04-1.69-.53-3.35-1.6-4.65-.07-.09-.18-.14-.29-.14-.09,0-.18.03-.25.09-.16.13-.19.38-.05.54.96,1.17,1.46,2.64,1.43,4.15Z"
      />
      <rect
        fill="${fill}"
        stroke="${stroke}"
        strokeMiterlimit="10"
        strokeWidth=".7px"
        x="12.92"
        y="8.49"
        width="3.92"
        height="6.19"
        rx=".3"
        ry=".3"
        transform="translate(-3.58 15.44) rotate(-49.71)"
      />
    </svg>`);
  }, [fill, stroke]);

  /*
   * Keep the icon canvas up to date
   */
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (context) {
    const im: HTMLImageElement = new Image();
    canvas.height = size + 15;
    canvas.width = size + 4;
    im.src = svgToMiniDataURI(svgEle);
    context.drawImage(im, 0, 10, size, size);
  }
  return canvas;
}
