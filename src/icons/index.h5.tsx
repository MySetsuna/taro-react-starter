/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';
import Icon from './h5';

export type IconNames = 'icon' | 'moments' | 'mine' | 'magazine';

interface Props {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  return <Icon name={name} size={parseFloat(Taro.pxTransform(size, 750))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 46,
};

export default IconFont;
