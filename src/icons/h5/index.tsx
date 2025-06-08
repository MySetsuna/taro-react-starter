/* tslint:disable */
/* eslint-disable */

import React, { SVGAttributes, FunctionComponent } from 'react';
import LuomaIcon from './LuomaIcon';
import LuomaMoments from './LuomaMoments';
import LuomaMine from './LuomaMine';
import LuomaMagazine from './LuomaMagazine';
export { default as LuomaIcon } from './LuomaIcon';
export { default as LuomaMoments } from './LuomaMoments';
export { default as LuomaMine } from './LuomaMine';
export { default as LuomaMagazine } from './LuomaMagazine';

export type IconNames = 'icon' | 'moments' | 'mine' | 'magazine';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'icon':
      return <LuomaIcon {...rest} />;
    case 'moments':
      return <LuomaMoments {...rest} />;
    case 'mine':
      return <LuomaMine {...rest} />;
    case 'magazine':
      return <LuomaMagazine {...rest} />;

  }

  return null;
};

export default IconFont;
