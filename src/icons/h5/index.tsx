/* tslint:disable */
/* eslint-disable */

import React, { SVGAttributes, FunctionComponent } from 'react';
import IconLmMagazine from './IconLmMagazine';
import IconLmMoments from './IconLmMoments';
import IconLmMine from './IconLmMine';
import IconLmMine1 from './IconLmMine1';
export { default as IconLmMagazine } from './IconLmMagazine';
export { default as IconLmMoments } from './IconLmMoments';
export { default as IconLmMine } from './IconLmMine';
export { default as IconLmMine1 } from './IconLmMine1';

export type IconNames = 'magazine' | 'moments' | 'mine' | 'mine1';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'magazine':
      return <IconLmMagazine {...rest} />;
    case 'moments':
      return <IconLmMoments {...rest} />;
    case 'mine':
      return <IconLmMine {...rest} />;
    case 'mine1':
      return <IconLmMine1 {...rest} />;

  }

  return null;
};

export default IconFont;
