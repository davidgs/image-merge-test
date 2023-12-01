import React, { useEffect, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { RGBColor } from 'react-color';
import mergeImages from 'merge-images';
import thrive from '../../assets/images/ThriveCode.png';
import Arrow from './Arrow';
import './App.css';
import QRIcon from './QrIcon';
import NFCIcon from './NFCIcon';
import Slider from './Slider';
import WiFiIcon from './WiFiIcon';
import WiFiIcon2 from './WiFiIcon2';
import TxtAsImage from './TxtAsImage';
import ColorPicker from './ColorPicker';
import Email1 from './Email1';

function Hello() {
  const [size, setSize] = React.useState<number>(30);
  const [qrsize, setQrSize] = React.useState<number>(200);
  const [showArrow, setShowArrow] = React.useState<boolean>(true);
  const [showIcon, setShowIcon] = React.useState<boolean>(true);
  const [backColor, setBackColor] = React.useState<RGBColor>({
    a: 1,
    b: 255,
    g: 255,
    r: 255,
  } as RGBColor);
  // const [mergeIm, setMergeIm] = React.useState<string>('');
  const [txtColor, settxtColor] = React.useState<RGBColor>({
    a: 1,
    b: 0,
    g: 0,
    r: 0,
  } as RGBColor);
  const [borderColor, setBorderColor] = React.useState<RGBColor>({
    a: 1,
    b: 0,
    g: 0,
    r: 0,
  } as RGBColor);
  // const [shadowColor, setShadowColor] = React.useState<RGBColor>({
  //   a: 1,
  //   b: 0,
  //   g: 0,
  //   r: 0,
  // } as RGBColor);
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

  const updateColor = (myColor: RGBColor) => {
    setBackColor(myColor);
  };
  /*
   * keep font menu options up to date
   */
  const fontMenuOptions = useMemo(() => {
    return fonts?.map((x) =>
      !x.startsWith('.') ? <option key={`font-${x}`}>{x}</option> : '',
    );
  }, [fonts]);

  const convertRGBToHex = (rgb: RGBColor): string => {
    const hex = `#${rgb.r.toString(16)}${rgb.g.toString(16)}${rgb.b.toString(
      16,
    )}`;
    return hex;
  };
  const nfcIcon: HTMLCanvasElement = NFCIcon(
    convertRGBToHex(backColor),
    convertRGBToHex(txtColor),
    size,
  );
  const email1Icon: HTMLCanvasElement = Email1(convertRGBToHex(txtColor), size);
  const qrIcon: HTMLCanvasElement = QRIcon(convertRGBToHex(txtColor), size);
  const arrowIcon: HTMLCanvasElement = Arrow(convertRGBToHex(txtColor), size);
  const wifiIcon: HTMLCanvasElement = WiFiIcon(convertRGBToHex(txtColor), size);
  const wifi2Icon: HTMLCanvasElement = WiFiIcon2(
    convertRGBToHex(txtColor),
    size,
  );

  /*
   * Canvas for the display text, converted to an image
   * @param backColor background color of canvas
   * @param txtColor text color of canvas
   * @param size size of text
   * @param qrsize size of qr code
   * @param font font of text
   * @param mergeText text to be merged
   * @returns base64 string of canvas
   */
  const txtImg: HTMLCanvasElement = TxtAsImage(
    convertRGBToHex(backColor),
    convertRGBToHex(txtColor),
    size,
    qrsize,
    activeFont,
    mergeText,
  );

  /*
   * keep the main canvas up to date
   * the main canvas is the background for the merged image
   * @returns HTMLCanvasElement
   */
  const mainCanvas: HTMLCanvasElement = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.height = qrsize + size + 40;
    canvas.width = qrsize + 20;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = convertRGBToHex(backColor);
      context.fillRect(0, 0, qrsize + 20, canvas.height);
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = borderWidth;
      context.strokeStyle = convertRGBToHex(borderColor);
      context.strokeRect(2, 2, canvas.width - 3, canvas.height - 3);
    }
    return canvas;
  }, [qrsize, size, backColor, borderColor, borderWidth]);

  /*
   * Keep the QR canvas up to date
   * @returns HTMLCanvasElement with the QR Code in it
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
  // const [mergeList, setMergeList] = React.useState<mergeImages.ImageSource[]>(
  //   [],
  // );
  const mergeList: mergeImages.ImageSource[] = useMemo(() => {
    const imgList = [];
    if (mainCanvas) {
      imgList.push({ src: mainCanvas.toDataURL(), x: 0, y: 0, name: 'main' });
    }
    if (qrCanvas) {
      imgList.push({ src: qrCanvas.toDataURL(), x: 10, y: 10, name: 'qr' });
    }
    if (txtImg) {
      imgList.push({
        src: txtImg.toDataURL(),
        x: mainCanvas.width / 2 - size * 2,
        y: qrsize + txtImg.height / 2.5,
        name: 'txt',
      });
    }
    if (showArrow) {
      imgList.push({
        src: arrowIcon.toDataURL(),
        x: 5,
        y: qrsize + 10,
        name: 'arrow',
      });
    }
    if (showIcon) {
      if (icon === 'email1') {
        imgList.push({
          src: email1Icon.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
          name: 'email1',
        });
      }
      if (icon === 'qr') {
        imgList.push({
          src: qrIcon.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
          name: 'qrIcon',
        });
      }
      if (icon === 'nfc') {
        imgList.push({
          src: nfcIcon?.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
          name: 'nfcIcon',
        });
      }
      if (icon === 'wifi1') {
        imgList.push({
          src: wifiIcon?.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
          name: 'wifiIcon',
        });
      }
      if (icon === 'wifi2') {
        imgList.push({
          src: wifi2Icon?.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
          name: 'wifi2Icon',
        });
      }
    }
    return imgList;
    // setMergeList(imgList);
  }, [
    mainCanvas,
    qrCanvas,
    txtImg,
    showArrow,
    showIcon,
    size,
    qrsize,
    arrowIcon,
    email1Icon,
    icon,
    qrIcon,
    nfcIcon,
    wifiIcon,
    wifi2Icon,
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
          style={{
            fontFamily: activeFont,
            color: `rgba(${txtColor.r}, ${txtColor.g}, ${txtColor.b}, ${txtColor.a})`,
          }}
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
      <span style={{ color: 'black' }}>QR Size: &nbsp;</span>
      <Slider value={qrsize} minVal={100} maxVal={500} callback={setQrSize} />
      <label htmlFor="backColor" style={{ color: 'black' }}>
        Background Color: &nbsp;
        <ColorPicker color={backColor} callback={updateColor} />
        {/* <select
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
        </select> */}
      </label>
      <p />
      <label htmlFor="borderColor" style={{ color: 'black' }}>
        Border Color: &nbsp;
        <ColorPicker color={borderColor} callback={setBorderColor} />
        {/* <select
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
        </select> */}
      </label>
      <p />
      <span style={{ color: 'black' }}>Border Width: &nbsp;</span>
      <Slider
        value={borderWidth}
        minVal={1}
        maxVal={10}
        callback={setBorderWidth}
      />
      <div id="mergedImage">
        <img id="mergeMe" alt="icon" />
      </div>
      <p />
      <div />
      <p />
      <span style={{ color: 'black' }}>Add-on Size: &nbsp;</span>
      <Slider
        value={size}
        minVal={10}
        maxVal={Math.round(qrsize * 0.2)}
        callback={setSize}
      />
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
            setIcon(v);
          }}
        >
          <option value="">Choose one ...</option>
          <option value="email1">Email</option>
          <option value="nfc">NFC</option>
          <option value="qr">QR Code</option>
          <option value="wifi1">WiFi</option>
          <option value="wifi2">WiFi2</option>
        </select>
      </label>
      <p />
      <label htmlFor="txtColor" style={{ color: 'black' }}>
        Add-on Color: &nbsp;
        <ColorPicker color={txtColor} callback={settxtColor} />
        {/* <select
          id="txtColor"
          name="txtColor"
          onChange={(e) => {
            const v = e.target.value;
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
        </select> */}
      </label>
      <p />
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
