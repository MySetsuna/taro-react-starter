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

const LuomaMoments: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'rem'} height={size + 'rem'} style={style} {...rest}>
      <path
        d="M703.034182 388.6336V71.560145s-155.156945-83.177891-336.278109-19.044072l336.279272 336.117527z m29.376 186.5344V84.652218s183.424 83.1232 235.115054 285.047855L732.410182 575.168z m-98.676364 142.576873l338.606546-318.427928s59.913309 97.406836-29.431855 318.427928H633.732655z m-172.900073 40.372363h457.325382S862.952727 907.755055 665.353309 969.536L460.834909 758.117236z m-149.2864-101.016436v298.100364s118.774691 76.061091 322.18531 24.991418L311.547345 657.1008z m-264.571345 15.418182l231.650909-207.848727v472.677236c0-0.001164-139.952873-48.581818-231.650909-264.828509z m-5.870545-33.245091S-11.884218 468.296145 62.231273 319.7952h318.615272L41.106618 639.275055z m41.14269-352.8064s67.028945-151.963927 249.262546-223.266909l217.476654 223.266909H82.248145z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

LuomaMoments.defaultProps = {
  size: 46,
};

export default LuomaMoments;
