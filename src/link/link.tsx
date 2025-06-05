import Taro from '@tarojs/taro'
import { Link as RLink, LinkProps } from 'react-router'

export const Link = (props: LinkProps) => {
  const env = Taro.getEnv()
  const isALIPAY = env === TaroGeneral.ENV_TYPE.ALIPAY
  const rest = {
    ...props,
    as: isALIPAY ? 'view' : undefined,
  } as LinkProps
  return <RLink {...rest} />
}
