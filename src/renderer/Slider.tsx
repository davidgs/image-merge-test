import React from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Slider({
  value,
  minVal,
  maxVal,
  callback,
}: {
  value: number;
  minVal: number;
  maxVal: number;
  callback: (value: number) => void;
}): React.JSX.Element {
  return (
    <OverlayTrigger placement="auto" overlay={<Tooltip>{value}</Tooltip>}>
      <RangeSlider
        value={value}
        min={minVal}
        max={maxVal}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          callback(parseInt(e.target.value, 10))
        }
        tooltipLabel={(currentValue) => `${currentValue}`}
        tooltip="on"
      />
    </OverlayTrigger>
  );
}
