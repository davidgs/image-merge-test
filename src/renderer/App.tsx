import React, { useEffect, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import mergeImages from 'merge-images';
import thrive from '../../assets/images/ThriveCode.png';
import Arrow from './Arrow';
import './App.css';
import QRIcon from './qrIcon';
import NFCIcon from './NFCIcon';
import txtAsImage from './TxtAsImage';

function Hello() {
  const [size, setSize] = React.useState<number>(30);
  const [qrsize, setQrSize] = React.useState<number>(200);
  const [showArrow, setShowArrow] = React.useState<boolean>(true);
  const [showIcon, setShowIcon] = React.useState<boolean>(true);
  const [backColor, setBackColor] = React.useState<string>('white');
  // const [mergeIm, setMergeIm] = React.useState<string>('');
  const [txtColor, settxtColor] = React.useState<string>('black');
  const [borderColor, setBorderColor] = React.useState<string>('black');
  const [borderWidth, setBorderWidth] = React.useState<number>(1);
  const [fonts, setFonts] = React.useState<string[]>();
  const [activeFont, setActiveFont] = React.useState<string>('Arial');
  const [mergeText, setMergeText] = React.useState<string>('Scan Me!');
  const [icon, setIcon] = React.useState<string>('nfc');

  /*
   * get the list of system fonts from the main process
   */
  useEffect(() => {
    window.electronAPI
      .getFont()
      .then((response) => {
        setFonts(response);
        return '';
      })
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.log(`Error: ${error}`);
      });
  }, []);

  /*
   * keep font menu options up to date
   */
  const fontMenuOptions = useMemo(() => {
    return fonts?.map((x) =>
      !x.startsWith('.') ? <option key={`font-${x}`}>{x}</option> : '',
    );
  }, [fonts]);

  const nfcIcon: HTMLCanvasElement = NFCIcon(backColor, txtColor, size);
  const qrIcon: HTMLCanvasElement = QRIcon(txtColor, size);
  const arrowIcon: HTMLCanvasElement = Arrow(txtColor, size);
  const txtImg: HTMLCanvasElement = txtAsImage(
    backColor,
    txtColor,
    size,
    qrsize,
    activeFont,
    mergeText,
  );

  /*
   * keep the main canvas up to date
   */
  const mainCanvas: HTMLCanvasElement = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.height = qrsize + size + 40;
    canvas.width = qrsize + 20;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = backColor;
      context.fillRect(0, 0, qrsize + 20, canvas.height);
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = borderWidth;
      context.strokeStyle = borderColor;
      context.strokeRect(2, 2, canvas.width - 3, canvas.height - 3);
    }
    return canvas;
  }, [qrsize, size, backColor, borderColor, borderWidth]);

  /*
   * Keep the QR canvas up to date
   */
  const qrCanvas: HTMLCanvasElement = useMemo(() => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.height = qrsize;
    canvas.width = qrsize;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (context) {
      const im: HTMLImageElement = new Image();
      im.src = thrive;
      context.drawImage(im, 2, 2, qrsize, qrsize);
    }
    return canvas;
  }, [qrsize]);

  /*
   * Keep the merged canvas up to date
   */
  const mergeList: mergeImages.ImageSource[] = useMemo(() => {
    const imgList = [];
    if (mainCanvas) {
      imgList.push({ src: mainCanvas.toDataURL(), x: 0, y: 0 });
    }
    if (qrCanvas) {
      imgList.push({ src: qrCanvas.toDataURL(), x: 10, y: 10 });
    }
    if (txtImg) {
      imgList.push({
        src: txtImg.toDataURL(),
        x: mainCanvas.width / 2 - size * 2,
        y: qrsize + txtImg.height / 2.5,
      });
    }
    // if (showArrow) {
    //   imgList.push({ src: arrowIcon.toDataURL(), x: 5, y: qrsize + 10 });
    // }
    if (showIcon) {
      if (icon === 'qr') {
        imgList.push({
          src: qrIcon.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
        });
      }
      if (icon === 'nfc') {
        imgList.push({
          src: nfcIcon?.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
        });
      }
    }
    return imgList;
  }, [
    mainCanvas,
    qrCanvas,
    txtImg,
    showArrow,
    showIcon,
    size,
    qrsize,
    arrowIcon,
    icon,
    qrIcon,
    nfcIcon,
  ]);

  useEffect(() => {
    if (mergeList && mergeList.length > 0) {
      mergeImages(mergeList)
        // eslint-disable-next-line promise/always-return
        .then((b64) => {
          const img = document.createElement('img');
          img.id = 'mergeMe';
          img.src = b64;
          img.onload = () => {
            const mergeMe = document.getElementById('mergedImage');
            const mm = mergeMe?.childNodes[0];
            if (mm) mergeMe?.removeChild(mm);
            mergeMe?.appendChild(img);
          };
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    }
  }, [mergeList]);

  return (
    <div style={{ overflow: 'scroll' }}>
      <p />
      <h1 style={{ color: 'black' }}>QR Code Generator</h1>
      <label htmlFor="mergeText" style={{ color: 'black' }}>
        Add Text: &nbsp;
        <input
          type="text"
          id="mergeText"
          style={{ fontFamily: activeFont, color: txtColor }}
          onChange={(e) => {
            const v = e.target.value;
            setMergeText(v);
          }}
          value={mergeText}
        />
      </label>
      <p />
      <label htmlFor="fontSelect" style={{ color: 'black' }}>
        Font: &nbsp;
        <select
          id="fontSelect"
          name="fontSelect"
          onChange={(e) => {
            const v = e.target.value;
            setActiveFont(v);
          }}
        >
          <option value="">Choose one ...</option>
          {fontMenuOptions}
        </select>
      </label>
      <p />
      <label htmlFor="qrsize" style={{ color: 'black' }}>
        QR Code Size: &nbsp;
        <input
          id="qrsize"
          type="range"
          min={100}
          max={500}
          step={25}
          value={qrsize}
          onChange={(e) => setQrSize(Number(e.target.value))}
        />
      </label>
      <p style={{ color: 'black' }}>size: {qrsize}</p>
      <p />
      <label htmlFor="backColor" style={{ color: 'black' }}>
        Background Color: &nbsp;
        <select
          id="backColor"
          name="backgroundColor"
          onChange={(e) => {
            const v = e.target.value;
            setBackColor(v);
          }}
        >
          <option value="">Choose one ...</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="purple">Purple</option>
        </select>
      </label>
      <p />
      <label htmlFor="borderColor" style={{ color: 'black' }}>
        Border Color: &nbsp;
        <select
          id="borderColor"
          name="BorderColor"
          onChange={(e) => {
            const v = e.target.value;
            setBorderColor(v !== '' ? v : 'black');
          }}
        >
          <option value="">Choose one ...</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="purple">Purple</option>
        </select>
      </label>
      <p />
      <label htmlFor="borderWidth" style={{ color: 'black' }}>
        Border Width: &nbsp;
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={borderWidth}
          onChange={(e) => setBorderWidth(Number(e.target.value))}
        />
      </label>
      <div id="mergedImage">
        <img id="mergeMe" alt="icon" />
      </div>
      <p />
      <div />
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
          checked={showIcon}
          onChange={(e) => {
            const v = e.target.checked;
            setShowIcon(v);
          }}
        />
        &nbsp;Show Icon
      </label>
      <p />
      <label htmlFor="whichIcon" style={{ color: 'black' }}>
        Icon: &nbsp;
        <select
          id="whichIcon"
          name="whichIcon"
          onChange={(e) => {
            const v = e.target.value;
            console.log(`whichIcon: ${v}`);
            setIcon(v);
          }}
        >
          <option value="">Choose one ...</option>
          <option value="nfc">NFC</option>
          <option value="qr">QR Code</option>
        </select>
      </label>
      <p />
      <label htmlFor="txtColor" style={{ color: 'black' }}>
        Add-on Color: &nbsp;
        <select
          id="txtColor"
          name="txtColor"
          onChange={(e) => {
            const v = e.target.value;
            console.log(`txtColor: ${v}`);
            settxtColor(v !== '' ? v : 'black');
          }}
        >
          <option value="">Choose one ...</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="purple">Purple</option>
        </select>
      </label>
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
