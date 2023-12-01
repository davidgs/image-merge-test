/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { SketchPicker, RGBColor, ColorResult } from 'react-color';
import { useState } from 'react';

export default function ColorPicker({
  color,
  callback,
}: {
  color: RGBColor;
  callback: (value: RGBColor) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  const handleClick = () => {
    setShowPicker(!showPicker);
  };
  const handleClose = () => {
    setShowPicker(false);
  };

  const setNewColor = (myColor: ColorResult) => {
    callback(myColor.rgb);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      style={{
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(66,11,95,.5)',
        display: 'inline-block',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        }}
      />
      {showPicker ? (
        <div style={{ zIndex: 2, position: 'absolute' }}>
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={handleClose}
          />
          <SketchPicker color={color} onChangeComplete={setNewColor} />
        </div>
      ) : null}
    </div>
  );
}
