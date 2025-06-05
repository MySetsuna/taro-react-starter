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

let IconLmMoments: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M679.17 398.982V126.497s-133.338-71.481-288.989-16.366l288.99 288.851z m25.245 160.303V137.748s157.63 71.434 202.052 244.963L704.415 559.285z m-84.8 122.527l290.99-273.649s51.488 83.709-25.293 273.649H619.614z m-148.586 34.695h393.014S816.6 845.102 646.788 898.195L471.03 716.507z m-128.293-86.811v256.18s102.072 65.365 276.878 21.477L342.736 629.696z m-227.366 13.25l199.075-178.62v406.207c0-0.001-120.272-41.75-199.075-227.587z m-5.045-28.57S64.787 467.442 128.48 339.824h273.81L110.326 614.377z m35.357-303.193s57.603-130.594 214.21-191.87l186.894 191.87H145.682z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </Svg>
  );
};

IconLmMoments.defaultProps = {
  size: 50,
};

IconLmMoments = React.memo ? React.memo(IconLmMoments) : IconLmMoments;

export default IconLmMoments;
