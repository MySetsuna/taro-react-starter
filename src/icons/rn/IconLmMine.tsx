/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

let IconLmMine: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M897.219 945.981v-7.314c-21.943-180.42-190.171-326.705-375.467-326.705-185.295 0-353.523 146.286-375.466 326.705v7.314H97.524v-7.314C114.59 780.19 226.743 636.343 375.467 582.705l4.876-2.438-4.876-2.438c-75.581-48.762-121.905-129.22-121.905-216.99 0-143.849 124.343-270.63 268.19-270.63 141.41 0 268.19 126.781 268.19 270.63 0 87.77-46.323 168.228-121.904 216.99l-4.876 2.438 4.876 2.438c148.724 53.638 260.876 197.485 277.943 355.962v7.314h-48.762z m-375.467-807.01c-109.714 0-219.428 109.715-219.428 221.867 0 117.029 114.59 202.362 219.428 202.362s219.429-87.771 219.429-202.362c0-112.152-109.714-221.867-219.429-221.867z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconLmMine.defaultProps = {
  size: 50,
};

IconLmMine = React.memo ? React.memo(IconLmMine) : IconLmMine;

export default IconLmMine;
