import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import mergeImages from 'merge-images';
import SvgResizer from 'react-svg-resizer';
import scan from '../../assets/images/SVG/Asset2.svg';
import thrive from '../../assets/images/ThriveCode.png';
import nfc1 from '../../assets/images/nfc-1.svg';
import arrow from '../../assets/images/Arrow.svg';
import NFCIcon from './NFCIcon';
import './App.css';

function Hello() {
  const nfci = NFCIcon();
  console.log(nfci);
  const [size, setSize] = React.useState<number>(30);
  const [scanImage, setScanImage] = React.useState<HTMLCanvasElement>();
  const [arrowImage, setArrowImage] = React.useState<HTMLCanvasElement>();
  const canvas = document.createElement('canvas');
  canvas.height = 280;
  canvas.width = 220;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = 'white';
    context.fillRect(0, 0, 220, 280);
    // context.globalCompositeOperation = 'destination-over';
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.strokeRect(2, 2, canvas.width - 3, canvas.height - 3);
  }

  const getArrow = () => {
    const acanvas = document.createElement('canvas');
    acanvas.height = size;
    acanvas.width = 200;
    const acontext = acanvas.getContext('2d');
    if(acontext) {
      acontext.globalCompositeOperation = 'source-over';
      const im = new Image();
      im.src = arrow;
      const imh = im.height;
      const imw = im.width;
      const finalw: number = size / 2;
      const rat: number = imh / imw;
      const finalh: number = finalw * rat;
      console.log(`imh: ${imh}, imw: ${imw}`);

      const cent = finalw / 2;
      const loc = acanvas.height / 2 - finalh / 2;
      console.log(`center: ${cent}, loc: ${loc}`);
      acontext.drawImage(im, finalw, loc, finalw, finalh);
    }
    setArrowImage(acanvas);
  };

  const getScan = () => {
    const scanvas = document.createElement('canvas');
    scanvas.height = size + 6;
    console.log(`size: ${size}`);
    scanvas.width = 200;
    const scontext = scanvas.getContext('2d');
    if (scontext) {
      // scontext.globalCompositeOperation = 'source-over';
      // scontext.lineWidth = 2;
      // scontext.strokeStyle = '#0000FF';
      // scontext.strokeRect(1, 1, canvas.width - 4, canvas.height - 1);
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

  useEffect(() => {
    getScan();
    getArrow();
  }, []);

  useEffect(() => {
    getScan();
    getArrow();
  }, [size]);

  const canvas2 = document.createElement('canvas');
  canvas2.height = 200;
  canvas2.width = 200;
  const context2 = canvas2.getContext('2d');
  if (context2) {
    const im = new Image();
    im.src = thrive;
    context2.drawImage(im, 0, 0, 200, 200);
  }

  useEffect(() => {
    mergeImages([
      { src: canvas.toDataURL(), x: 0, y: 0 },
      { src: canvas2.toDataURL(), x: 10, y: 10 },
      arrowImage
        ? { src: arrowImage?.toDataURL(), x: 5, y: 220 }
        : { src: '', x: 0, y: 0 },
      scanImage
        ? { src: scanImage?.toDataURL(), x: 5, y: 220 }
        : { src: '', x: 0, y: 0 },
    ])
      // eslint-disable-next-line no-return-assign
      .then((b64) => (document.getElementById('mergeMe').src = b64))
      .catch((error) => console.log(error));
  }, [scanImage, canvas, canvas2]);

  return (
    <div>
      <h1
        id="headText"
        style={{ fontFamily: 'Bradley Hand, cursive', color: 'black' }}
      >
        Scan Me
      </h1>
      <p />
      <img id="logo" width="200" alt="icon" src={thrive} />
      <p />
      <img id="mergeMe" alt="icon" />
      <p />
      <div />
      <img src={nfc1} alt="nfc" />
      <p />
      <h2>done!</h2>
      {/* <div style={{ border: '1px solid black' }}>
        <SvgResizer size={size}>
          <NFCIcon />
      </SvgResizer>
      </div> */}
      <p />
      <input
        type="range"
        max={100}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
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
