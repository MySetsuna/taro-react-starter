/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';

export type IconNames = 'magazine' | 'moments' | 'mine' | 'mine1';

export interface IconProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<IconProps> = () => {
  return null;
};

export default IconFont;
