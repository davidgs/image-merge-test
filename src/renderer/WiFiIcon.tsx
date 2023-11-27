import svgToMiniDataURI from 'mini-svg-data-uri';

export default function WifiIcon(
  stroke: string,
  size: number,
): HTMLCanvasElement {
  const wifi1 = `
  <svg
      id="wifi1-svg-icon"
      xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 72.51 55.93"
  >
  <path fillRule="evenodd" clipRule="evenodd" fill="${stroke}" d="m36.27,41.75c3.91,0,7.09,3.17,7.09,7.09s-3.17,7.09-7.09,7.09-7.09-3.17-7.09-7.09,3.17-7.09,7.09-7.09h0Z"/>
  <path fillRule="evenodd" clipRule="evenodd" fill="${stroke}" d="m36.26,6.98c11.87.06,22.61,4.87,30.42,12.63,4.47,3.2,7.89-2.86,4.39-5.47C62.04,5.43,49.77.06,36.26,0,22.74.06,10.47,5.43,1.44,14.14c-3.5,2.62-.08,8.67,4.39,5.47,7.81-7.76,18.55-12.57,30.42-12.63h0Z"/>
  <path fillRule="evenodd" clipRule="evenodd" fill="${stroke}" d="m36.26,20.95c7.82.06,14.91,3.15,20.16,8.16,4.06,3.82,7.99-1.04,5.33-4.56-6.55-6.5-15.55-10.53-25.48-10.59-9.94.06-18.94,4.09-25.48,10.59-2.66,3.52,1.26,8.38,5.33,4.56,5.25-5.01,12.34-8.11,20.16-8.16h0Z"/>
  <path fillRule="evenodd" clipRule="evenodd" fill="${stroke}"  d="m36.26,34.91c4.27.05,7.53,1.62,10.68,4.45,4.57,3.21,8.03-2.67,4.38-5.47-3.97-3.66-9.25-5.91-15.05-5.97-5.81.06-11.09,2.31-15.05,5.97-3.65,2.8-.19,8.68,4.38,5.47,3.15-2.83,6.4-4.4,10.68-4.45h0Z"/>
  </svg>`;

  /*
   * Keep the arrow canvas up to date
   */
  const canvas = document.createElement('canvas');
  canvas.height = size + 15;
  canvas.width = size;
  const context = canvas.getContext('2d');
  if (context) {
    const im = new Image();
    im.src = svgToMiniDataURI(wifi1);
    context.drawImage(im, 0, 10, size, size);
  }
  return canvas;
}
