/* tslint:disable */
/* eslint-disable */

import React, { SVGAttributes, FunctionComponent } from 'react';
import LuomaMoments from './LuomaMoments';
import LuomaMine from './LuomaMine';
import LuomaMagazine from './LuomaMagazine';
export { default as LuomaMoments } from './LuomaMoments';
export { default as LuomaMine } from './LuomaMine';
export { default as LuomaMagazine } from './LuomaMagazine';

export type IconNames = 'moments' | 'mine' | 'magazine';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
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
