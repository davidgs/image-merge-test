import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import mergeImages from 'merge-images';
import svgToMiniDataURI from 'mini-svg-data-uri';
import thrive from '../../assets/images/ThriveCode.png';
import './App.css';

function Hello() {
  const [size, setSize] = React.useState<number>(30);
  const [qrsize, setQrSize] = React.useState<number>(200);
  const [scanCanvas, setScanCanvas] =
    React.useState<HTMLCanvasElement | null>();
  const [arrowCanvas, setArrowCanvas] = React.useState<HTMLCanvasElement>();
  const [textCanvas, setTextCanvas] = React.useState<HTMLCanvasElement>();
  const [mainCanvas, setMainCanvas] = React.useState<HTMLCanvasElement>();
  const [qrCanvas, setQrCanvas] = React.useState<HTMLCanvasElement>();
  const [showArrow, setShowArrow] = React.useState<boolean>(true);
  const [showNFC, setShowNFC] = React.useState<boolean>(true);
  const [backColor, setBackColor] = React.useState<string>('white');
  const [mergeIm, setMergeIm] = React.useState<string>('');
  const [txtColor, settxtColor] = React.useState<string>('black');
  const [borderColor, setBorderColor] = React.useState<string>('black');
  const [borderWidth, setBorderWidth] = React.useState<number>(1);
  const [fonts, setFonts] = React.useState<string[]>();
  const [font, setFont] = React.useState<string>('Arial');

  useEffect(() => {
    window.electronAPI
      .getFont()
      .then((response) => {
        console.log(response);
        setFonts(response);
        // setMainConfig(JSON.parse(response));
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  useEffect(() => {
    fonts?.map((font) => {
      const newOption = document.createElement('option');
      newOption.value = font;
      newOption.innerText = font;
      newOption.style.fontFamily = font;
      const select = document.getElementById('fontSelect');
      select?.appendChild(newOption);
      return '';
    });
  }, [fonts]);

  const nfcSVG = `<svg
      id="scanIcon"
      xmlns="http://www.w3.org/2000/svg"
      width="180"
      height="170"
      viewBox="0 0 18.73 16.42"
    >
      <circle
        strokeWidth=".77px"
        fill="${backColor}"
        stroke="${txtColor}"
        cx="8.21"
        cy="8.21"
        r="7.83"
      />
      <path
        fill="${txtColor}"
        d="m4.84,9.59c-.17.13-.19.38-.06.54.13.17.38.19.54.06.59-.48.92-1.18.9-1.94-.02-.71-.34-1.37-.89-1.82-.07-.06-.16-.09-.25-.09-.11,0-.21.05-.29.14-.13.16-.11.41.05.54.37.31.6.76.61,1.24.01.52-.21,1-.62,1.32Z"
      />
      <path
        fill="${txtColor}"
        d="m6.91,8.27c0,.8-.31,1.55-.86,2.13-.15.15-.14.4,0,.54.15.15.4.14.54,0,.69-.72,1.08-1.66,1.08-2.66,0-1-.38-1.95-1.08-2.68-.08-.08-.18-.12-.28-.12-.1,0-.19.04-.27.11-.15.15-.16.39,0,.54.56.58.87,1.34.86,2.14Z"
      />
      <path
        fill="${txtColor}"
        d="m8.45,8.27c-.01,1.1-.42,2.17-1.14,3.01-.14.16-.12.4.04.54.16.14.4.12.54-.04.84-.97,1.31-2.21,1.33-3.5.02-1.34-.46-2.64-1.34-3.65-.07-.09-.18-.13-.28-.13-.09,0-.18.03-.26.09-.16.14-.18.38-.04.54.76.87,1.17,1.98,1.15,3.14Z"
      />
      <path
        fill="${txtColor}"
        d="m9.95,8.29c-.03,1.43-.53,2.77-1.44,3.88-.13.16-.11.41.05.54.16.14.41.11.54-.05,1.02-1.24,1.58-2.74,1.61-4.35.04-1.69-.53-3.35-1.6-4.65-.07-.09-.18-.14-.29-.14-.09,0-.18.03-.25.09-.16.13-.19.38-.05.54.96,1.17,1.46,2.64,1.43,4.15Z"
      />
      <rect
        fill="${backColor}"
        stroke="${txtColor}"
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
    </svg>`;

  const arrowSVG = `
    <svg
      id="arrowIcon"
      xmlns="http://www.w3.org/2000/svg"
      width="180"
      height="170"
      viewBox="0 0 77.84 141.16"
    >
      <g id="Layer_1-2">
        <path fill="${txtColor}" d="m77.01,139.82c.12.2.69-.92.83-1.1-.44.06-.98,1.39-.83,1.1Z"/>
        <polygon fill="${txtColor}" points="72.56 140.46 72.88 140.06 71.78 140.86 72.56 140.46"/>
        <path fill="${txtColor}" d="m69.78,138.67c-.9,1.97,1.19.37,1.27,1.33l-.18.47,1.14-1.32c-.74-.14-2.14.3-2.23-.48Z"/>
        <path fill="${txtColor}" d="m70.89,133.86c-.38.75-.71.39.19.43.02-.1.04-.15.06-.21-.06-.03-.14-.08-.24-.22Z"/>
        <path fill="${txtColor}" d="m71.14,134.08c.31.13.2-.7,0,0h0Z"/>
        <path fill="${txtColor}" d="m69.57,133.62l.79-.37c.2-.46-.06-.76.26-.98-.6.08-.8.53-1.05,1.35Z"/>
        <path fill="${txtColor}" d="m68.34,134.67l.37-.12c.08-.19.08-.29-.37.12Z"/>
        <path fill="${txtColor}" d="m69.49,134.27l-.78.27c-.14.32-.53.9.32-.07-.39.5.04.05.46-.21Z"/>
        <path fill="${txtColor}" d="m69.54,134.69c-.05.52.06.95-.74,1.31.89.23,1.61-1.09.74-1.31Z"/>
        <path fill="${txtColor}" d="m68.43,140.44l-.05.72.64-.44c-.32.22-.25-.85-.59-.28Z"/>
        <path fill="${txtColor}" d="m67.97,131.12c-.29.35-.59,1.07-.9,1.57l.57-.24c.04-.35-.05-.77.33-1.33Z"/>
        <path fill="${txtColor}" d="m67.07,132.69l-.86.35c.31.33.59.08.86-.35Z"/>
        <polygon fill="${txtColor}" points="66.93 136.58 68.53 135.69 66.78 136.5 66.93 136.58"/>
        <polygon fill="${txtColor}" points="66.49 130 67.34 129.31 66 130.3 66.49 130"/>
        <path fill="${txtColor}" d="m65.41,129.4c.69-.57.67-1.35,1.17-1.65-.35-.08-1.03.35-1.65.73.44-.13.61.12.48.92Z"/>
        <path fill="${txtColor}" d="m63.99,128.99c.24-.08.58-.29.94-.51-.24.07-.53.21-.94.51Z"/>
        <path fill="${txtColor}" d="m65.66,132.36c.13-.24.5-.87.45-1.27l-.6,1.14s.1.08.15.13Z"/>
        <path fill="${txtColor}" d="m65.49,132.27l.02-.04c-.15-.15-.26-.25-.3-.3.04.04.12.14.28.34Z"/>
        <path fill="${txtColor}" d="m65.69,132.39l-.04-.03c-.06.11-.07.15.04.03Z"/>
        <path fill="${txtColor}" d="m66.52,134.86c-.65.42-1.61.68-1.75,1.92.68-.59.76-1.3,1.75-1.92Z"/>
        <path fill="${txtColor}" d="m64.95,133.83l.26.55c.19-.28.4-.74.73-.94l-.99.39Z"/>
        <polygon fill="${txtColor}" points="64.49 134.01 64.95 133.83 64.85 133.63 64.49 134.01"/>
        <path fill="${txtColor}" d="m63.96,130.49c-.52.31-.74.19-1.02.09.08.38.25.68.49.86.28-.29.82-.79.53-.95Z"/>
        <path fill="${txtColor}" d="m64.63,131.45s-.05.01-.08.03c-.04.11-.04.15.08-.03Z"/>
        <path fill="${txtColor}" d="m60.77,128.87c-.04.07-.08.14-.11.21l.15-.17-.04-.04Z"/>
        <path fill="${txtColor}" d="m63.32,131.66c.03.34.33.17.67-.06-.21,0-.4-.05-.56-.16-.13.13-.2.23-.1.22Z"/>
        <path fill="${txtColor}" d="m63.02,129c-.07.28-.11.54-.13.79.16-.39.36-1.03.13-.79Z"/>
        <path fill="${txtColor}" d="m64.7,131.15s.04-.02.06-.03c.11-.26.03-.15-.06.03Z"/>
        <path fill="${txtColor}" d="m64.7,131.15c-.2.08-.47.27-.71.44.17,0,.35-.03.56-.11.03-.09.09-.22.15-.33Z"/>
        <path fill="${txtColor}" d="m54.91,134.7c.79-.89,1.96-1.34,1.57,0,.98-.37,3.13-3.63,4.17-5.61-.34.39-.64.77-1.48.97-.27.62-.05,1.94-1.07,2.49-.93.02-.18-.7-.05-1.41-.71,1.34-2.06,1.08-3.33,2.86l.98-.18c-.21.27-.73.54-.79.89Z"/>
        <path fill="${txtColor}" d="m61.36,129.79l.26.02c-.07-.31.09-.79.42-1.71-.64.24-.97.53-1.24.82.23.27.48.52.72.78l-.17.09Z"/>
        <path fill="${txtColor}" d="m62.38,130.39c-.93.92-1.68,1.03-2.29,2.33.57.32,1.02-.58,1.67-.79-1.01-.37.67-.39.54-1.42.29-.05.48,0,.64.07-.05-.24-.07-.5-.05-.79-.01.03-.02.05-.03.08h0s-.01.01-.01.01c-.07.15-.11.24-.1.14-.01,0-.02,0-.03,0-.11.14-.23.25-.33.36-.07-.39.17-.29.33-.36.04-.05.08-.1.13-.15,0,0,0,0,0-.01l-1.24-.06c.06.27.3.41.76.58Z"/>
        <path fill="${txtColor}" d="m62.69,138.71c.04-.11.09-.19.15-.26-.15.09-.23.16-.15.26Z"/>
        <path fill="${txtColor}" d="m62.79,137.83c.17-.1.52-.48.65-.23-.05.44-.36.5-.6.86.32-.19.97-.45.95-1.23l-.16.1c-.09-.61.42-2.23.58-2.33-.59,1.01-.98,1.75-1.42,2.84Z"/>
        <path fill="${txtColor}" d="m62.3,134.35l-1.07-.03-.32,1.16.39-.55c.24.52.65-.21,1.01-.59Z"/>
        <polygon fill="${txtColor}" points="61.1 128.31 62.04 127.32 60.45 128.5 61.1 128.31"/>
        <polygon fill="${txtColor}" points="60.16 127.73 60.94 126.84 60.26 127.21 60.16 127.73"/>
        <path fill="${txtColor}" d="m10.98,83.32l-.41-.15c.14.09.27.13.41.15Z"/>
        <path fill="${txtColor}" d="m11.62,85.24l.57-.16c-.33.03-.57.07-.57.16Z"/>
        <path fill="${txtColor}" d="m41.4,108.62c.66-.97,1.79-2.32.76-1.48l-.97.88c.34.06.34.3.21.6Z"/>
        <path fill="${txtColor}" d="m24.58,96.99c-.09.09-.19.19-.29.29.43-.13.84-.25,1.21-.37-.28.02-.59.05-.92.08Z"/>
        <path fill="${txtColor}" d="m19.71,99.3l.49-.86c-.2.24-.37.52-.49.86Z"/>
        <path fill="${txtColor}" d="m6.43,73.08h-1.36c.13.51.72.12,1.36,0Z"/>
        <path fill="${txtColor}" d="m51.52,120.57c.14-.58.11-.9,0-1.1-.26.79-.83,1.8,0,1.1Z"/>
        <path fill="${txtColor}" d="m24.23,79.32c-.28-.06-.55-.03-.82.07.26.07.53.07.82-.07Z"/>
        <path fill="${txtColor}" d="m50.88,118.84c-.06.13-.07.22-.11.33.31.01.6.04.74.3.2-.58.21-1.04-.63-.63Z"/>
        <path fill="${txtColor}" d="m4.89,32.69c.06-.02.09-.05.17-.07-.17-.03-.19,0-.17.07Z"/>
        <path fill="${txtColor}" d="m19.84,24.28c.05.12.01.28-.01.43.11-.05.13-.18.01-.43Z"/>
        <path fill="${txtColor}" d="m57.19,124.45c.23.09.12-.08,0,0h0Z"/>
        <path fill="${txtColor}" d="m54.64,129.09c-.13.07-.29.19-.49.41.22-.22.38-.35.49-.41Z"/>
        <path fill="${txtColor}" d="m43.41,122.73v-.02c-.15.23-.12.19,0,.02Z"/>
        <path fill="${txtColor}" d="m57.05,125.13c.04-.18.06-.35.04-.49-.03.11-.05.26-.04.49Z"/>
        <path fill="${txtColor}" d="m57.42,124.63c.02.1.05.16.07.23.16-.14.24-.26-.07-.23Z"/>
        <path fill="${txtColor}" d="m56.9,124.29c.11.07.16.2.19.35.03-.1.06-.16.1-.19-.06-.03-.15-.07-.29-.16Z"/>
        <path fill="${txtColor}" d="m7.86,54.09s.06-.04.12-.06c-.56-.22-.46-.11-.12.06Z"/>
        <path fill="${txtColor}" d="m26.75,111.45s.05-.01.07-.01c0-.02.01-.04.02-.06l-.08.07Z"/>
        <path fill="${txtColor}" d="m25.42,111.23c1.56-.59,1.52-.29,1.41.15l2.92-2.38-4.33,2.23Z"/>
        <path fill="${txtColor}" d="m9.08,78.84l-.91.99c-2.1-.18-1.61-.97-3.01.14,3.9-1.13,1.23,2.39,5.12,1.19l-.67.69c0-.13-.24-.07-.24-.2-1.57,1.44,2.99-.35,2.79.85-.17.46-.64.91-1.18.83l1.24.45c.01.26-.67.44-.69.19l.76,1.09-.12.03c.66-.05,1.73-.02,2.2.01-.43.51-.46,0-.9.26l1.17.3c-.88.66-2.04.48-2.08-.03-3.55,2.1,1.16.18-.53,2.4l-.72-.44c-1.99,1.27-1.02,1.46-2.04,2.73.61-.47,2.76-2.81,4-2.47-.2.32-.22.64.7.71-1.34.56-.85.8-.57,1.24l-1.78.72c.73.3,1.61-.13,2.53-.17.07.64-1.24,1.35-2.33,2,.12,1.04,1.91-1.59,2.7-.66-.36,1.06.62,1.26,2.08,1.65-.35.8-1.11.41-1.51.83l1.6-.2c.02.13-.42.29-.64.38.72.13,1.75-.79,2.5-.42,1.98-.78-2.19,2.59.33,2.26-.39.43-1.1.44-1.73.83,1.93.29,1.48.35,3.79.18l-.75,1.28c1-1.18,2.85-1.33,4.37-1.45.52-.51.98-.94,1.18-1.18l1.36.37c-.22.25-.85.49-1.62.73.17-.02.34-.04.49-.06-.46.65-1.51,1.03-2.57,1.31.29-.29.58-.59.87-.89-1.14.34-2.39.74-3.35,1.32.23-.05.45-.02.61.05-.31.09-.58.19-.73.31-.16.13.26.02.77-.07l-1.77,1.23.77-.36c-.19.62-.35,1.23-.51,1.84,2.37-.21,5.53-1.08,7.02-.26-1.53.49-2.24,1.24-3.85,2.18,1.48-1.36-1.31-.6-1.37-1.49.03.46-.79.83-1.1.89l2.26.33c-1.32.75-.83.84-1.18,1.49,2.43-1.78,2.25-.12,3.35-.13-.84.56-1.79.99-1.96.26-1.51,1.85,3.54-1.01,2.31.64-.11-.13-.03-.29-.5-.07.97-.14.89,1.06.03,1.34l-.11-.13c.15.58.62,1.31,1.31,1.74.71.42,1.67.52,2.77-.12-.27.2-2.63,1.6-3.1,1.83,2.76-1.04,5.49-2.12,8.2-3.23-1.9,1.11-5.79,4.66-7.34,4.59-.1.4-.21.89.75.92.15-.34,2.33-2.2,2.64-2.11-1.6,1.97-.8,1.14-2,3.06.22-.5,3.19-2.25,3.35-1.85-.46.25-2.72,2.02-3.11,2.1l3.37-1.12c-.65.15-2.33,1.66-2.95,2.42.46-.49.52.8.97.83l.35-.84c.34,1.3,4.5-1.9,5.07-.85-.63.31-3.61,2.34-3.56,3.1,1.55-.83,7.31-4.18,8.96-4.25l-.64.77,1.36-.11c-2.3,1.3-7.43,3.65-9.61,4.34-.32.85-.83.82-.32,1.31-.57.77-1.34.58-1.51.45l.57,1.66c1.52-1.33,2.36-.31,3.61-1.43l-2.73-.04c1.53-1.31,5.08-2.82,5.5-1.74-.44.74-2.89,2.13-3.4,2.58.63-.33,1.7,0,1.39.38l-1.14.32c-.17.99,2.72-.95,1.75.88.07.28-1.44,2.3-.51,1.55,1.44-1.84,6.78-6.56,8.25-7.5-.06.16-.8,2.42-1.46,3.4-1.07,1.52-3.63,2.39-4.55,3.69.42-.35,1.09-.63,1.31-.7-.17.52-1.35,1.05-.77,1.34,1.58-1.29.67,1.03,1.47-.95.81.04.1.74.63,1.18.82-1.05,3.71-2.61,4.52-2.62-.4.33-.81.89-.99,1.15.66.96.42,2.07,1.16,2.87-.28.42-.33,1.21-1.11,1.67.37-.14.97-.53,1.24-.33-.78,1.71-.74-.34-1.88,1.52.87-.81,1.79-.54,2.66-.74,1.18-1.41-.54-1.02-1.42-.84,1.8-1.78,4.26-3.08,5.86-3.16,1.06.15-.87,1.44-.51,1.29.89,1.47,4.02-2.22,3.77,0-.7,1.54-2.16,2.37-2.86,3.31-.95-.04-.13-1.49-.52-1.79l-.09.97c-.54.24-1.16.19-1.03-.33-.68,1.4,1.89,2.12,1.96,3.99.53-.25,1.2-.4,1.49-1.01l-.45-.11c.59-1.22,1.76-.83,1.79-1.63,1.02-.33,2.38-.99,2.48.04l-1.09,1.48c.34-.42.33-1.14-.19-.86.77-.42-.73,2.64,1.1,1.03l.42-1.31c1.01-.36,2.77-1.44,2.9-.57.94-1.58-.25.06.76-1.86-1.4,2.28-1.2-1.14-2.5,1.38,1.24-2.18.04-1.31.97-3.31-.39.47-.6,1.02-.81.43-.14.12-.33.25-.44.32,0-.02,0-.03,0-.06l-.03.07c-.08.05-.09.07,0,.03-.08.29-.21.6-.4.88-1.12.86-1.75.24-2.45.58-.05-.44.57-.43.87-1.03l-1.05.5c.87-1.03.87-2.24,1.96-2.31l-.47-.5c.21-.83.01-1.41-.63-1.22-.04-.42-1.61.52-.68-.05l-1.34-.14.23-.25c-.63-.85-3.14.06-2.28-2.51-.49-.02-1.04,0-1.18-.7l.76-.89c-.61-.05-.09-1.79-1.11-1.1.98-1.25.73-1.76.22-2.07-.5-.33-1.26-.48-1.31-.96l-1.16.99c-.3-.47-.97-.58-1.89-.7l-.99.91c-1.24.27-.29-1.78-.98-2.42.44-.28.48,0,.35.32,1.65-2.79-3.21-.45-2.13-2.64-.55.11-.54-.14-.37-.49.02.02.05.02.09,0,0-.03-.02-.06-.05-.09.12-.23.26-.49.35-.72-.2.28-.35.53-.39.68-.14-.14-.45-.28-.89-.3l1.07-.98s-.04-.02-.07-.03c.25-.55-.68.23-1.46,1.01-.28.03-.59.09-.93.21,1.72-1.59-1.09-.15.71-1.89-1.09.57-1.61-.63-3.78.73.26-.2.34-.37.45-.25.03-.43.09-.88-.67-.71l1.42-1.18-2.43.83c.67-1.01,1.1-1.52,2.51-1.97-2.38.38-1.15-.22-3.44.25l1.01-.63c-.22-.24-1.84.22-1.13-.48,1.52-1.84-1.67-3.16-.8-5.82-2.83,2.1.92-1.53-1.44-.21.66-.51.94-.96,1.7-1.07-1.16-.39.45-1.84-1.85-1.26.67-.5,1.15-.42,1.54-.75-.19.03-.77.1-.39-.22.38-.32.67-.22,1.06-.28-.59-.72-2.85.41-4.98,1.5.76-.98.52-1.11-1.03-.68.61-.52,1.2-1.15,1.73-.76-.06-.35.07-2.32-1.65-1.48.38-.32-.09-.48-.33-.46-.25-.72-.11-.86-.6-1.44l-.19.32c-2.2.76-.73-.33-1.24-.75l.22-.09c.92-1.95-.98-.2.16-2.22l-1.28.67c-2.88,1.18,1.15-1.85-.22-2.08l-.64.59c-1.14.02,3.38-2.78,3.58-3.31.21-.19.45-.04.68,0,1.25-1.71-1.79.61-2.52.02.88-.53,2.46-.82,2.42-1.39.64-.54-3.65-.23-2.11-1.65-.67.44-1.34.88-2.03.73-.48-.46,2.21-2.52-.3-2.16.18-.14.36-.24.54-.31-.77-.19-1.47-1.02-2.83-.84,2.28-1.01,1.49-1.47.66-1.88-.83-.41-1.69-.77.5-1.46-.22-.41-.42-.83-.63-1.25l.46-.1c.05-.93-1.1-.91-2.24-.91.24-.28.7-.26.93-.31.53-1.5.29-1.53-2.17-2.02l1.41-.48c-.91-.09,1.82-2.36-.17-3.18.17-.03.46-.06.68-.01-1.02-.49-.16-1.55.25-2.37.42-.83.41-1.43-2.3-1.19-.5-.23-1.01-.45-1.49-.69-.19,1.29-2.35.23-3.15.89-.4-.44,1.41-1.55,1.78-1l-.25.14c2.81-.27.75-1.69,2.65-1.96-.55-2.35.78-4.85.68-7.04l-2.17.45.07-.79c.49-.25,1.69-.41,1.64.15,1.22-.39-1.1-.84-1.58-.83.81-1.15,2.58.24,2.61-.1l-.19-.43-.25.12c-.92-.3-1.87-.27-1.81-.94.41-.45,1.34-.29,1.41-.46.16,0,.23-.07.05-.25.04-.32.08-.65.14-.97l-1.72.46c-.86-.4.07-.93-1.88-.39,3.02-.79.99-3.72,1.94-4.15-1.25-.61-1.21-1.23-1.04-1.98-.37.18-2.31.25-2.06-.41,4.02.35,1.76-1.15,4.68-1.53-1.95.37-.35-1.83-3.12-1.26.36-.52,1.5.06,2.48-.29-1.47-1.38,1.18-2.7.87-4.27-.52-.09-1.35.09-2.1-.34l2.71-.51c-.22-.33-2.99-.67-1.11-.99-.45.02-1.13.05-1.27-.18,1.48-1.36,1.24-2.96,1.25-4.57.1-1.58.44-3.19,3.16-4.09-1.1.16-1.13-.13-1.08-.45-.29.14-1.26-.32-1.97-.45l2.26-.77c-1.86-.74.23-1.38-1.57-2.03l.22.5c-2.01-1.16-5-.56-7.76-1.37,2.3,1.28-4.13.81-.86,2.78-.62.11-.86-.42-1.53-.45,1.14.57,1.32.95.64,1.45l-.28-.14c-.06,1.82-1.49,2.3-2.6,4.2l1.42.1c-.26.4-.71.41-1.1.55,2.04.85.32-1.19,2.59-.33-2.94.08-.53,2.98-3.85,2.89-.11.67,1.65.03,1.55.7l-.9.06,1.12.32c-.24.41-1.37.49-2.12.41.1-.1-.17-.33-.22-.46-1.11.45.16,1.67-.2,1.83l.62-.59c.31.97.09,1.98.05,2.99-.03,1.02.06,2.04.9,2.98l.68-.09c1.16,1.4-.83,1.03-.29,2.53l-.16-.06c.66.32.99.72.9,1.11-.78-.39-1.54.67-2.4.16,1.3,1.49,1.03.75,3.5,1.73l-1.12.21c1,.33,1.52.35,1.83,1.07-.97-.59-1.68.48-2.96-.19-2.4,1.6,2.51,2.23-1.03,3.04,3.09.6,1.68-1.38,2.35-1.01,1-.35,2.31.51,2.02.99-.05.47-3.94.97-3.79,2.23,0-.12-.23-.12-.22-.25-.75.51,1.12.85-.11,1.5,1.88.19-.05.75,2.32.67l-.63-1.09c.66.61,3.48.98,2.2,2.12-.48-.04-1.13-.3-1.5-.48-.68.37.5.55-.19.93-2.37.12-.61-1.33-2.46-1.89-.98.41,1.81,1.19-.78,1.04,3.3.24-.34,1.28,2.26,1.89l-1.42.08c.24.11.94.32.93.57l-1.89-.26c1.64.52-1.22,1.48-.29,2.06-.2-1.39,1.67-.51,2.64-1.2,2.09,1.45-3.6,1.4-2.68,3.25-.25-.23.73-1.09,1.43-.77-.26.4-.71.95-1.42,1.28.49,1.22,1.42-.4,2.37,0-1.65.68.79.51,1.43.96l-1.43.23c-.69,1.57,3.04-.11,2.13,1.33l-2.06-.2.62.58-1.64.14c1.31.53,1.04.8.74,1.59.97-.35,2.6-.39,2.77.21-.76.58-1.4.03-1.02.86-.93-.02-2.09-.02-.86-.66-.47.05-.93-.03-1.4.02-.88.65.02,1.21.09,1.53.03-.14.07-.3.26-.42l2.23.88c-.49.31-.95.25-1.4.18.21.23.9.27,1.09.62-1.17.15-2.35.44-3,0,.51.32,1.01.65,1.54.96-.48.19-1.22.94-1.68.88-.5.86,2.63,1.15,1.97,2.26.23,0,.47.03.68.18-.06.91-1.24,2.04.6,2.6l-1.86,1.14c.69.65,2.33-1.49,3.47-.43.91.71-1.63.85-2.09,1.34,1.16.16,3.42.3,2.07,1.63-.47-.15-.25-.46-.47-.67Zm4.21,8.97c-.35-.06-1.36-.07-.61-.52,1.62-.41.94.03.61.52Zm9.5,11.74c-.49.11-.38-.19-.01-.66.19.1.23.3.01.66Zm31.72,24.07s-.04.02-.06.04c.1-.67.05-.41.06-.04Zm.16.99c.19-.09.33-.25.44-.42-.29.23-.44.13-.52-.08-.21.32-.32.58.08.5ZM17.4,50.84l-.37.17c-.44-.32-.06-.25.37-.17Z"/>
        <path fill="${txtColor}" d="m20.28,99.04c.19-.16.42-.3.65-.44-.25.05-.5.18-.65.44Z"/>
        <path fill="${txtColor}" d="m6.68,73.08s0-.02,0-.03c-.09,0-.18.02-.26.03h.25Z"/>
        <path fill="${txtColor}" d="m36.9,124.09c.04-.27.17-.52.33-.76-.27.23-.44.49-.33.76Z"/>
        <path fill="${txtColor}" d="m59.41,125.52l-.63-.03c.23.1.09.4.04.65.21-.26.46-.7.59-.62Z"/>
        <path fill="${txtColor}" d="m57.18,135.28c.17-.09.14.09.32,0l.4-.54c-.29-.17-.81.11-.72.55Z"/>
        <path fill="${txtColor}" d="m56.66,129.49c-.76.96-.24.85.19.91-.02-.01-.04-.02-.05-.04,1.17-1.24.52-1.05-.14-.87Z"/>
        <path fill="${txtColor}" d="m56.94,130.42c.12.03.23.08.28.19.47-.5-.01-.2-.28-.19Z"/>
        <path fill="${txtColor}" d="m55.96,124.69c-.08.35,1.12-1.09.86-.66,1.17-1.03-2.08.65-.86.66Z"/>
        <polygon fill="${txtColor}" points="54.3 132.74 55.17 131.51 54.23 132.3 54.3 132.74"/>
        <path fill="${txtColor}" d="m52.79,130l.16.71c.16-.2.31-.26.45-.28-.24-.28-.34-.78-.62-.43Z"/>
        <path fill="${txtColor}" d="m53.41,130.43c.12.15.29.24.53.12-.09-.06-.29-.15-.53-.12Z"/>
        <polygon fill="${txtColor}" points="53.38 132.56 53.45 132.21 53.2 131.86 53.38 132.56"/>
        <path fill="${txtColor}" d="m48.33,125.46l-.76-.14c-.41.32-.5.67-.19.69.36-.15.67-.12.95-.55Z"/>
        <path fill="${txtColor}" d="m46.9,129.81c.09-.35.31-.6.58-1.03l-1.3,1.34.72-.3Z"/>
        <path fill="${txtColor}" d="m45.21,128.77c-.41.33-1.73.38-1.04.89.41-.32,1.19-.16,1.04-.89Z"/>
        <polygon fill="${txtColor}" points="40.04 119.92 40.16 120.03 42.44 117.99 40.04 119.92"/>
        <path fill="${txtColor}" d="m28.69,117.64c-.09,1.1,1.61-.99,1.33.16.69-.29.23-.94.84-1.16-.9.08-.71-.39-2.17,1.01Z"/>
        <path fill="${txtColor}" d="m30.87,116.63c.14-.01.31-.03.52-.08-.23,0-.39.04-.52.08Z"/>
        <polygon fill="${txtColor}" points="21.86 23.07 22.59 22.8 21.53 22.81 21.86 23.07"/>
        <path fill="${txtColor}" d="m19.91,21.6l1.9.43-1.62-.76c.06.13.16.37-.28.33Z"/>
        <path fill="${txtColor}" d="m10.26,90.67l.45-.14c.43-.27.42-.4.39-.67l-.84.81Z"/>
        <polygon fill="${txtColor}" points="8.97 83.32 8.97 83.45 10.56 82.65 8.97 83.32"/>
        <path fill="${txtColor}" d="m4.94,78.13c0,.27.46.44.46.71-.46-.44,1.63-1.39-.46-.71Z"/>
        <polygon fill="${txtColor}" points="0 18.39 23.59 0 27.73 29.63 0 18.39"/>
      </g>
    </svg>`;

  const makeTextCanvas = () => {
    const text = document?.getElementById('headText')?.innerHTML ?? 'Scan Me';
    const canvas = document.createElement('canvas');
    canvas.width = qrsize;
    canvas.height = size;
    canvas.style.backgroundColor = backColor;
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${size / 2}px ${font}`;
      const finalw: number = size / 2;
      const loc = canvas.height / 2;
      context.fillStyle = txtColor;
      context.fillText(text, finalw, loc, qrsize - size);
    }
    setTextCanvas(canvas);
  };

  const makeMainCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.height = qrsize + size + 20;
    canvas.width = qrsize + 20;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = backColor;
      context.fillRect(0, 0, qrsize + 20, canvas.height);
      // context.globalCompositeOperation = 'destination-over';
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = borderWidth;
      context.strokeStyle = borderColor;
      // context.stroke
      context.strokeRect(2, 2, canvas.width - 3, canvas.height - 3);
    }
    setMainCanvas(canvas);
  };

  const makeArrowCanvas = () => {
    const canvas2 = document.createElement('canvas');
    canvas2.height = size;
    canvas2.width = size;
    const context2 = canvas2.getContext('2d');
    if (context2) {
      const im = new Image();
      im.src = svgToMiniDataURI(arrowSVG);
      context2.drawImage(im, 0, 0, size, size);
    }
    setArrowCanvas(canvas2);
  };

  const makeScanCanvas = () => {
    const canvas2 = document.createElement('canvas');
    canvas2.height = size;
    canvas2.width = size;
    const context2 = canvas2.getContext('2d');
    if (context2) {
      const im = new Image();
      im.src = svgToMiniDataURI(nfcSVG);
      context2.drawImage(im, 0, 0, size, size);
    }
    setScanCanvas(canvas2);
  };

  const makeQrCanvas = () => {
    const canvas2 = document.createElement('canvas');
    canvas2.height = qrsize;
    canvas2.width = qrsize;
    const context2 = canvas2.getContext('2d');
    if (context2) {
      const im = new Image();
      im.src = thrive;
      context2.drawImage(im, 0, 0, qrsize, qrsize);
    }
    setQrCanvas(canvas2);
  };

  useEffect(() => {
    makeScanCanvas();
    makeArrowCanvas();
    makeMainCanvas();
    makeQrCanvas();
    makeTextCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    makeScanCanvas();
    makeArrowCanvas();
    makeMainCanvas();
    makeQrCanvas();
    makeTextCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    size,
    qrsize,
    backColor,
    showArrow,
    showNFC,
    txtColor,
    borderColor,
    borderWidth,
    font,
  ]);

  useEffect(() => {
    const imgList = [];
    if (mainCanvas) {
      imgList.push({ src: mainCanvas.toDataURL(), x: 0, y: 0 });
    }
    if (qrCanvas) {
      imgList.push({ src: qrCanvas.toDataURL(), x: 10, y: 10 });
    }
    if (textCanvas) {
      imgList.push({
        src: textCanvas.toDataURL(),
        x: mainCanvas?.width / 2 - size * 2,
        y: qrsize + textCanvas.height / 2.5,
      });
    }
    if (showArrow) {
      if (arrowCanvas) {
        imgList.push({ src: arrowCanvas.toDataURL(), x: 5, y: qrsize + 10 });
      }
    }
    if (showNFC) {
      if (scanCanvas) {
        imgList.push({
          src: scanCanvas.toDataURL(),
          x: qrsize - size,
          y: qrsize + 10,
        });
      }
    }

    if (imgList.length > 0) {
      mergeImages(imgList)
        // eslint-disable-next-line promise/always-return
        .then((b64) => {
          setMergeIm(b64);
          const mergeMe = document.getElementById('mergedImage');
          const mm = mergeMe?.childNodes[0];
          // eslint-disable-next-line promise/always-return
          if (mm) mergeMe?.removeChild(mm);
          const img = document.createElement('img');
          img.id = 'mergeMe';
          img.src = b64;
          // eslint-disable-next-line promise/always-return
          mergeMe?.appendChild(img);
        })
        .catch((error) => console.log(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scanCanvas,
    mainCanvas,
    qrCanvas,
    arrowCanvas,
    showArrow,
    showNFC,
    textCanvas,
  ]);

  return (
    <div>
      <h1 id="headText" style={{ fontFamily: font, color: txtColor }}>
        Scan Me
      </h1>
      <p />
      <label htmlFor="fontSelect" style={{ color: txtColor }}>
        <span style={{ fontFamily: font, color: txtColor }}>
          {' '}
          Font: &nbsp;{' '}
        </span>{' '}
      </label>
      <select
        id="fontSelect"
        name="fontSelect"
        onChange={(e) => {
          const v = e.target.value;
          console.log(`fontSelect: ${v}`);
          setFont(v);
        }}
      />
      <p />
      {/* <p />
      <img id="logo" width={qrsize} alt="icon" src={thrive} />
      <p /> */}
      <label style={{ color: 'black' }}>QR Code Size: &nbsp;</label>
      <input
        type="range"
        min={100}
        max={500}
        step={25}
        value={qrsize}
        onChange={(e) => setQrSize(Number(e.target.value))}
      />
      <p style={{ color: 'black' }}>size: {qrsize}</p>
      <p />
      <select
        id="backColor"
        name="backgroundColor"
        onChange={(e) => {
          const v = e.target.value;
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
      <select
        id="borderColor"
        name="BorderColor"
        onChange={(e) => {
          const v = e.target.value;
          setBorderColor(v);
        }}
      >
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="purple">Purple</option>
      </select>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={borderWidth}
        onChange={(e) => setBorderWidth(Number(e.target.value))}
      />
      <div id="mergedImage">
        <img src={mergeIm} id="mergeMe" alt="icon" />
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
