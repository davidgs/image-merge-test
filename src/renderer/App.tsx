import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import mergeImages from 'merge-images';
import SvgResizer from 'react-svg-resizer';
import scan from '../../assets/images/SVG/Asset2.svg';
import thrive from '../../assets/images/ThriveCode.png';
import nfc1 from '../../assets/images/nfc-1.svg';
import arrow from '../../assets/images/Arrow.svg';
import './App.css';

function Hello() {
  const [size, setSize] = React.useState<number>(30);
  const [qrsize, setQrSize] = React.useState<number>(200);
  const [scanImage, setScanImage] = React.useState<HTMLCanvasElement>();
  const [arrowImage, setArrowImage] = React.useState<HTMLCanvasElement>();
  const [canvasArea, setCanvasArea] = React.useState<HTMLCanvasElement>();
  const [qrImage, setQRimage] = React.useState<HTMLCanvasElement>();

  const makeCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.height = qrsize + size + 20;
    canvas.width = qrsize + 20;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'white';
      context.fillRect(0, 0, qrsize + 20, qrsize + 60);
      // context.globalCompositeOperation = 'destination-over';
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 1;
      context.strokeStyle = '#000000';
      context.strokeRect(2, 2, canvas.width - 3, canvas.height - 3);
    }
    setCanvasArea(canvas);
  };

  const getArrow = () => {
    const acanvas = document.createElement('canvas');
    acanvas.height = size;
    acanvas.width = size; //qrsize + 20;
    const acontext = acanvas.getContext('2d');
    if (acontext) {
      acontext.globalCompositeOperation = 'source-over';
      const im = new Image();
      im.src = arrow;
      const imh = im.height;
      const imw = im.width;
      const finalw: number = size / 2;
      const rat: number = imh / imw;
      const finalh: number = finalw * rat;
      console.log(`arrow imh: ${imh}, imw: ${imw}`);

      const cent = finalw / 2;
      const loc = acanvas.height / 2 - finalh / 2;
      console.log(`arrow center: ${cent}, loc: ${loc}`);
      acontext.drawImage(im, finalw - 5, loc, finalw, finalh);
    }
    setArrowImage(acanvas);
  };

  const getScan = () => {
    const scanvas = document.createElement('canvas');
    scanvas.height = size; // + 6;
    console.log(`size: ${size}`);
    scanvas.width = size; //qrsize + 10;
    const scontext = scanvas.getContext('2d');
    if (scontext) {
      scontext.globalCompositeOperation = 'source-over';
      const im = new Image();
      im.src = nfc1;
      const imh = im.height;
      const imw = im.width;
      const finalw: number = size * 0.8;
      const rat: number = imh / imw;
      const finalh: number = finalw * rat;
      console.log(`imh: ${imh}, imw: ${imw}`);

      const cent = finalw / 2;
      const loc = scanvas.height / 2 - finalh / 2; // - imh / 2;
      console.log(`center: ${cent}, loc: ${loc}`);
      scontext.drawImage(im, scanvas.width - finalw, loc, finalw, finalh);
    }
    setScanImage(scanvas);
  };

  const getQR = () => {
    const canvas2 = document.createElement('canvas');
    canvas2.height = qrsize;
    canvas2.width = qrsize;
    const context2 = canvas2.getContext('2d');
    if (context2) {
      const im = new Image();
      im.src = thrive;
      context2.drawImage(im, 0, 0, qrsize, qrsize);
    }
    setQRimage(canvas2);
  };
  useEffect(() => {
    getScan();
    getArrow();
    makeCanvas();
    getQR();
  }, []);

  useEffect(() => {
    getScan();
    getArrow();
    makeCanvas();
    getQR();
  }, [size, qrsize]);

  useEffect(() => {
    mergeImages([
      canvasArea
        ? { src: canvasArea.toDataURL(), x: 0, y: 0 }
        : { src: '', x: 0, y: 0 },
      qrImage
        ? { src: qrImage.toDataURL(), x: 10, y: 10 }
        : { src: '', x: 0, y: 0 },
      arrowImage
        ? { src: arrowImage.toDataURL(), x: 5, y: qrsize + 10 }
        : { src: '', x: 0, y: 0 },
      // text-to-image
      // textImage ? { src: textImage.toDataURL(), x: sixe + 10, y: qrsize + 10 } : { src: '', x: 0, y: 0 },
      scanImage
        ? { src: scanImage.toDataURL(), x: qrsize - size, y: qrsize + 10 }
        : { src: '', x: 0, y: 0 },
    ])
      // eslint-disable-next-line no-return-assign
      .then((b64) => (document.getElementById('mergeMe').src = b64))
      .catch((error) => console.log(error));
  }, [scanImage, canvasArea, qrImage, arrowImage]);

  return (
    <div>
      <h1
        id="headText"
        style={{ fontFamily: 'Bradley Hand, cursive', color: 'black' }}
      >
        Scan Me
      </h1>
      <p />
      <img id="logo" width={qrsize} alt="icon" src={thrive} />
      <p />
      <input
        type="range"
        min={100}
        max={500}
        value={qrsize}
        onChange={(e) => setQrSize(Number(e.target.value))}
      />
      <p />
      <img id="mergeMe" alt="icon" />
      <p />
      <div />
      <p />
      <input
        type="range"
        max={100}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
      <p />
      ...
      <p />
      <div>
        <p>FOO</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
