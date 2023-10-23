/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import React, { useEffect, useState, KeyboardEventHandler } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { OverlayTrigger, Tooltip, Row } from 'react-bootstrap';
import { ClipboardData, Clipboard2CheckFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import potrace from 'potrace';
import { MainSettings } from './types';

export default function QCode({
  link,
  settings,
}: {
  link: string | null;
  settings: MainSettings;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  const [mySettings, setMySettings] = useState<MainSettings>(settings);
  const [qrState, setQrState] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState<string>('');
  const darkClass = 'header-stuff-dark';
  const darkIconClass = 'copy-icon header-stuff-dark';
  const iconButtonClass = 'button-icon header-stuff-dark';

  // const loadImage = (file: string) => {};
  // useEffect(() => {
  //   setMySettings(settings);
  //   console.log(
  //     `QRCode.tsx: settings.QRSettings.QRImageFile: ${settings.QRSettings.QRImageFile}`,
  //   );
  //   if (settings.QRSettings.QRImageFile !== '') {
  //     window.electronAPI
  //       .loadFile(settings.QRSettings.QRImageFile)
  //       .then((result) => {
  //         const fType = settings.QRSettings.QRImageFile.split('.').pop();
  //         const image = Buffer.from(result, 'base64').toString('base64');
  //         setQrImage(`data:image/${fType};base64,${image}`);
  //       })
  //       .catch((error: unknown) => {
  //         console.log(`Error: ${error}`);
  //       });
  //   }
  // }, [settings]);

  const saveSVG = () => {
    const background = mySettings.QRSettings.XParent
      ? 'none'
      : mySettings.QRSettings.QRProps?.bgColor;
    const canvas = document.getElementById(
      'react-qrcode-logo',
    ) as HTMLCanvasElement;
    const params = {
      background,
      color: mySettings.QRSettings.QRProps?.fgColor,
    };
    const dataURL = canvas?.toDataURL(`image/${mySettings.QRSettings.QRType}`);
    potrace.trace(dataURL, params, function (err: any, svg: any) {
      if (err) throw err;
    });
  };

  const onDownloadClick = () => {
    if (mySettings.QRSettings.QRType === 'svg') {
      saveSVG();
      return;
    }
    const canvas = document.getElementById(
      'react-qrcode-logo',
    ) as HTMLCanvasElement;
    const dataURL = canvas?.toDataURL(`image/${mySettings.QRSettings.QRType}`);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `qrcode-id.${mySettings.QRSettings.QRType}`;
    a.click();
  };

  // Copy link to the clipboard and change the icon to a checkmark
  function copyMe(): void {
    setCopied(!copied);
    if (link) {
      navigator.clipboard
        .writeText(link)
        .then(null, null)
        // eslint-disable-next-line no-console
        .catch((err) => console.error('Error: ', err));
    }
  }

  return (
    <div>
      <div
        className="alert-columns"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <div className="alert-column1">
          {copied && (
            <OverlayTrigger
              delay={{ show: 250, hide: 300 }}
              rootClose
              overlay={
                <Tooltip id="alert-tooltip">
                  You have successfully copied the link!
                </Tooltip>
              }
            >
              <Clipboard2CheckFill
                className={darkIconClass}
                style={{
                  fontSize: '2rem',
                }}
              />
            </OverlayTrigger>
          )}
          {!copied && (
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 300 }}
              rootClose
              overlay={
                <Tooltip id="alert-copied-tooltip">
                  Click here to copy your link!
                </Tooltip>
              }
            >
              <ClipboardData
                className={darkIconClass}
                style={{
                  fontSize: '2rem',
                }}
                tabIndex={0}
                cursor="pointer"
                role="button"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={copyMe}
                // eslint-disable-next-line react/jsx-no-bind
                onKeyDown={null as unknown as KeyboardEventHandler}
                title="Click to copy your link!"
              />
            </OverlayTrigger>
          )}
        </div>
        <div className="alert-column2">
          <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 300 }}
            rootClose
            overlay={
              <Tooltip id="alert-copy-link-tooltip">
                {qrState
                  ? 'This data is encoded in the QR Code'
                  : 'Click here to copy your link!'}
              </Tooltip>
            }
          >
            <div
              onClick={copyMe}
              onKeyDown={null as unknown as KeyboardEventHandler}
              role="button"
              tabIndex={0}
            >
              <strong style={{ cursor: 'pointer' }} className={darkClass}>
                {link}
              </strong>
            </div>
          </OverlayTrigger>
        </div>
        <div className="alert-column3">
          <Row style={{ margin: 'auto' }}>
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 300 }}
              rootClose
              overlay={
                <Tooltip id="qrcode-tooltip">
                  Click the QR Code or the &lsquo;Download&rsquo; button to save
                  the QR Code
                </Tooltip>
              }
            >
              <div
                // ref={ref}
                onClick={onDownloadClick}
                onKeyDown={null as unknown as KeyboardEventHandler}
                role="button"
                tabIndex={-1}
              >
                <QRCode
                  id="react-qrcode-logo"
                  value={link || 'http://example.com'}
                  size={mySettings.QRSettings.QRProps.size}
                  bgColor={mySettings.QRSettings.QRProps.bgColor}
                  fgColor={mySettings.QRSettings.QRProps.fgColor}
                  logoImage={qrImage}
                  qrStyle={mySettings.QRSettings.QRProps.qrStyle}
                  logoWidth={mySettings.QRSettings.QRProps.logoWidth}
                  logoHeight={mySettings.QRSettings.QRProps.logoHeight}
                  logoOpacity={mySettings.QRSettings.QRProps.logoOpacity}
                  eyeColor={mySettings.QRSettings.QRProps.eyeColor}
                  eyeRadius={mySettings.QRSettings.QRProps.eyeRadius}
                  quietZone={mySettings.QRSettings.QRProps.quietZone}
                  enableCORS={mySettings.QRSettings.QRProps.enableCORS}
                  ecLevel={mySettings.QRSettings.QRProps.ecLevel}
                  logoPadding={mySettings.QRSettings.QRProps.logoPadding}
                  logoPaddingStyle={
                    mySettings.QRSettings.QRProps.logoPaddingStyle
                  }
                />
              </div>
            </OverlayTrigger>
          </Row>
        </div>
      </div>
    </div>
  );
}

QCode.propTypes = {
  link: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    QRProps: PropTypes.shape({
      size: PropTypes.number.isRequired,
      bgColor: PropTypes.string.isRequired,
      fgColor: PropTypes.string.isRequired,
      qrStyle: PropTypes.oneOf(['dots', 'rounded']).isRequired,
      logoWidth: PropTypes.number.isRequired,
      logoHeight: PropTypes.number.isRequired,
      logoOpacity: PropTypes.number.isRequired,
      eyeColor: PropTypes.string.isRequired,
      eyeRadius: PropTypes.number.isRequired,
      quietZone: PropTypes.number.isRequired,
      enableCORS: PropTypes.bool.isRequired,
      ecLevel: PropTypes.oneOf(['L', 'M', 'Q', 'H']).isRequired,
      logoPadding: PropTypes.number.isRequired,
      logoPaddingStyle: PropTypes.oneOf(['default', 'none', 'round'])
        .isRequired,
    }).isRequired,
  }).isRequired,
};
