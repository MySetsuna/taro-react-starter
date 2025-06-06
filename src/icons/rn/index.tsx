/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import LuomaMoments from './LuomaMoments';
import LuomaMine from './LuomaMine';
import LuomaMagazine from './LuomaMagazine';
export { default as LuomaMoments } from './LuomaMoments';
export { default as LuomaMine } from './LuomaMine';
export { default as LuomaMagazine } from './LuomaMagazine';

export type IconNames = 'moments' | 'mine' | 'magazine';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

let IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'moments':
      return <LuomaMoments key="1" {...rest} />;
    case 'mine':
      return <LuomaMine key="2" {...rest} />;
    case 'magazine':
      return <LuomaMagazine key="3" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
