/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconLmMagazine from './IconLmMagazine';
import IconLmMoments from './IconLmMoments';
import IconLmMine from './IconLmMine';
import IconLmMine1 from './IconLmMine1';
export { default as IconLmMagazine } from './IconLmMagazine';
export { default as IconLmMoments } from './IconLmMoments';
export { default as IconLmMine } from './IconLmMine';
export { default as IconLmMine1 } from './IconLmMine1';

export type IconNames = 'magazine' | 'moments' | 'mine' | 'mine1';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

let IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'magazine':
      return <IconLmMagazine key="1" {...rest} />;
    case 'moments':
      return <IconLmMoments key="2" {...rest} />;
    case 'mine':
      return <IconLmMine key="3" {...rest} />;
    case 'mine1':
      return <IconLmMine1 key="4" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
