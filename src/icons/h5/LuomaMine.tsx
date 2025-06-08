/* tslint:disable */
/* eslint-disable */

import React, { CSSProperties, SVGAttributes, FunctionComponent } from 'react';
import { getIconColor } from './helper';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: 'block',
};

const LuomaMine: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
      <path
        d="M950.945745 1013.505164v-8.510837c-25.533673-209.943273-221.289891-380.165818-436.907054-380.165818-215.616 0-411.372218 170.223709-436.905891 380.165818v8.510837H20.391564v-8.510837C40.250182 820.584727 170.755491 653.199127 343.816145 590.784l5.673891-2.836945-5.673891-2.836946c-87.9488-56.741236-141.853091-150.365091-141.85309-252.497454 0-167.387927 144.690036-314.914909 312.075636-314.91491 164.549818 0 312.075636 147.526982 312.075636 314.91491 0 102.132364-53.903127 195.756218-141.851927 252.497454l-5.673891 2.836946 5.673891 2.836945c173.060655 62.415127 303.5648 229.800727 323.424582 414.210327v8.510837h-56.741237z m-436.907054-939.066182c-127.6672 0-255.3344 127.668364-255.3344 258.172509 0 136.1792 133.341091 235.475782 255.3344 235.475782s255.335564-102.133527 255.335564-235.475782c0-130.504145-127.6672-258.172509-255.335564-258.172509z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

LuomaMine.defaultProps = {
  size: 46,
};

export default LuomaMine;
