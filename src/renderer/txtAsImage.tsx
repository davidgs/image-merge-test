/**
 * @param backColor background color of canvas
 * @param txtColor text color of canvas
 * @param size size of text
 * @param qrsize size of qr code
 * @param font font of text
 * @param mergeText text to be merged
 * @returns base64 string of canvas
 */
export default function txtAsImage(
  backColor: string,
  txtColor: string,
  size: number,
  qrsize: number,
  font: string,
  mergeText: string,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = qrsize;
  canvas.height = size + 15;
  canvas.style.backgroundColor = backColor;
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${size / 2}px ${font}`;
    const finalw: number = size / 2;
    const loc = canvas.height / 2;
    context.fillStyle = txtColor;
    context.fillText(mergeText, finalw, loc, qrsize - size);
  }
  return canvas;
}
