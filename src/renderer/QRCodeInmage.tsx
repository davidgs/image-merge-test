import svgToMiniDataURI from 'mini-svg-data-uri';

export default function QRCodeImage(size: number): HTMLCanvasElement {
  /*
   * Keep the QRCode canvas up to date
   */
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.height = size;
  canvas.width = size;
  const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (context) {
    const im: HTMLImageElement = new Image();
    im.src = thrive;
    context.drawImage(im, 2, 2, size, size);
  }
  return canvas;
}
