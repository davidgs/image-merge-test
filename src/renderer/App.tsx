import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import mergeImages from 'merge-images';
import thrive from '../../assets/images/ThriveCode.png';
import nfc1 from '../../assets/images/nfc-1.svg';
import arrow from '../../assets/images/Arrow.svg';
import './App.css';
import NFCIcon from './NFCIcon';

function Hello() {
  const [size, setSize] = React.useState<number>(30);
  const [qrsize, setQrSize] = React.useState<number>(200);
  const [scanImage, setScanImage] = React.useState<HTMLCanvasElement>();
  const [arrowImage, setArrowImage] = React.useState<HTMLCanvasElement>();
  const [textImage, setTextImage] = React.useState<HTMLCanvasElement>();
  const [canvasArea, setCanvasArea] = React.useState<HTMLCanvasElement>();
  const [qrImage, setQRimage] = React.useState<HTMLCanvasElement>();
  const [showArrow, setShowArrow] = React.useState<boolean>(true);
  const [showNFC, setShowNFC] = React.useState<boolean>(true);
  const [backColor, setBackColor] = React.useState<string>('white');
  const [mergeIm, setMergeIm] = React.useState<string>('');
  const [arrowIm, setArrowIm] = React.useState<HTMLImageElement>();
  const [txtColor, settxtColor] = React.useState<string>('black');
  const [nfc2Im, setNfc2Im] = React.useState<React.JSX.Element>(nfc2);

  const makeTextImage = () => {
    const text = document?.getElementById('headText')?.innerHTML ?? 'Scan Me';
    // const { width, height } = image.getSize();
    const canvas = document.createElement('canvas');
    canvas.width = qrsize;
    canvas.height = size;
    canvas.style.backgroundColor = backColor;
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${size / 2}px Bradley Hand, cursive`;
      const finalw: number = size / 2;
      const finalh: number = finalw;
      const cent = finalw / 2;
      const loc = canvas.height / 2 ;
      context.fillStyle = txtColor;
      context.fillText(text, finalw, loc, qrsize - size);
    }
    setTextImage(canvas);
  };

  const makeCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.height = qrsize + size + 20;
    canvas.width = qrsize + 20;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = backColor;
      context.fillRect(0, 0, qrsize + 20, canvas.height);
      // context.globalCompositeOperation = 'destination-over';
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 1;
      context.strokeStyle = '#000000';
      context.strokeRect(2, 2, canvas.width - 3, canvas.height - 3);
    }
    setCanvasArea(canvas);
  };

  useEffect(() => {
    const el = document.getElementsByClassName('.cls-1');
    console.log(`el: ${el}`);
  }, [txtColor]);


  const getArrow = () => {
    const acanvas = document.createElement('canvas');
    acanvas.height = size;
    acanvas.width = size; //qrsize + 20;
    const acontext = acanvas.getContext('2d');
    if (acontext) {
      acontext.fillStyle = backColor;
      acontext.globalCompositeOperation = 'source-over';
      const ah = arrowIm?.height ?? 0;
      const aw = arrowIm?.width ?? 0;
      const c = arrowIm?.style.color;
      console.log(`arrow ah: ${ah}, aw: ${aw}, c: ${c}`);
      const im = new Image();
      const a = arrow;

      im.src = arrow;
      const foo = new XMLSerializer().serializeToString(im);
      const imh = im.height;
      const imw = im.width;
      const finalw: number = size / 2;
      const rat: number = imh / imw;
      const finalh: number = finalw * rat;
      console.log(`arrow imh: ${imh}, imw: ${imw}`);
      acontext.strokeStyle = 'blue';
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
      scontext.fillStyle = backColor;
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
    makeTextImage();
  }, []);

  useEffect(() => {
    getScan();
    getArrow();
    makeCanvas();
    getQR();
    makeTextImage();
  }, [size, qrsize, backColor, showArrow, showNFC, txtColor]);

  useEffect(() => {
    const imgList = [];
    if (canvasArea) {
      imgList.push({ src: canvasArea.toDataURL(), x: 0, y: 0 });
    }
    if (qrImage) {
      imgList.push({ src: qrImage.toDataURL(), x: 10, y: 10 });
    }
    if (textImage) {
      imgList.push({
        src: textImage.toDataURL(),
        x: (canvasArea?.width / 2) - size*2 ,
        y: qrsize + textImage.height / 2.5,
      });
    }
    if (showArrow) {
      if (arrowImage) {
        imgList.push({ src: arrowImage.toDataURL(), x: 5, y: qrsize + 10 });
      }
    }
    if (showNFC) {
      if (scanImage) {
        imgList.push({
          src: scanImage.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
        });
      }
    }

    if (imgList.length > 0) {
      mergeImages(imgList)
        .then((b64) => setMergeIm(b64))
        .catch((error) => console.log(error));
    }
    //document.getElementById('mergeMe').src = b64))
    // mergeImages([
    //   canvasArea
    //     ? { src: canvasArea.toDataURL(), x: 0, y: 0 }
    //     : { src: '', x: 0, y: 0 },
    //   qrImage
    //     ? { src: qrImage.toDataURL(), x: 10, y: 10 }
    //     : { src: '', x: 0, y: 0 },
    //   // arrowImage && showArrow
    //   //   ? { src: arrowImage.toDataURL(), x: 5, y: qrsize + 10 }
    //   //   : { src: '', x: 0, y: 0 },
    //   // text-to-image
    //   // textImage
    //   //   ? { src: textImage.toDataURL(), x: size + 10, y: qrsize + 10 }
    //   //   : { src: '', x: 0, y: 0 },
    //   scanImage
    //     ? { src: scanImage.toDataURL(), x: qrsize - size, y: qrsize + 10 }
    //     : { src: '', x: 0, y: 0 },
    // ])
    // eslint-disable-next-line no-return-assign
    // .then((b64) => (document.getElementById('mergeMe').src = b64))
    // .catch((error) => console.log(error));
  }, [scanImage, canvasArea, qrImage, arrowImage, showArrow, showNFC]);

  return (
    <div>
      <h1
        id="headText"
        style={{ fontFamily: 'Bradley Hand, cursive', color: 'black' }}
      >
        Scan Me
      </h1>
      {/* <p />
      <img id="logo" width={qrsize} alt="icon" src={thrive} />
      <p /> */}
      <input
        type="range"
        min={100}
        max={500}
        step={25}
        value={qrsize}
        onChange={(e) => setQrSize(Number(e.target.value))}
      />
      <h4 style={{ color: 'black' }}>QR Code Size: {qrsize}</h4>
      <p />
      <select
        id="backColor"
        name="backgroundColor"
        onChange={(e) => {
          const v = e.target.value;
          console.log(`backColor: ${v}`);
          setBackColor(v);
        }}
      >
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="purple">Purple</option>
      </select>
      <p />
      <img src={mergeIm} id="mergeMe" alt="icon" />
      <p />
      <div />
      {/* <img id="mergeMe" alt="icon" src={textImage} /> */}
      <p />
      <input
        type="range"
        max={100}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
      <h4 style={{ color: 'black' }}>Add-ons Size: {size}</h4>
      <p />
      <label htmlFor="checkArrow" style={{ color: 'black' }}>
        <input
          id="checkArrow"
          type="checkbox"
          checked={showArrow}
          onChange={(e) => {
            const v = e.target.checked;
            setShowArrow(v);
          }}
        />
        &nbsp;Show Arrow
      </label>
      &nbsp;&nbsp;
      <label htmlFor="checkNFC" style={{ color: 'black' }}>
        <input
          id="checkNFC"
          type="checkbox"
          checked={showNFC}
          onChange={(e) => {
            const v = e.target.checked;
            setShowNFC(v);
          }}
        />
        &nbsp;Show NFC Symbol
      </label>
      <p />
      <select
        id="txtColor"
        name="txtColor"
        onChange={(e) => {
          const v = e.target.value;
          console.log(`txtColor: ${v}`);
          settxtColor(v);
        }}
      >
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="purple">Purple</option>
      </select>
      <p />
      <div>
        <p>FOO</p>
      </div>
      <div style={{ display: 'none' }}>
        <img id="arrow" alt="icon" src={arrow} />
        <NFCIcon id="nfcicon" fill="#fff" stroke={txtColor} />
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
