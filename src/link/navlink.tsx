import Taro from '@tarojs/taro'
import { NavLink as RLink, NavLinkProps } from 'react-router'

export const NavLink = (props: NavLinkProps) => {
  const env = Taro.getEnv()
  const isALIPAY = env === TaroGeneral.ENV_TYPE.ALIPAY
  const rest = {
    ...props,
    as: isALIPAY ? 'view' : undefined,
  } as NavLinkProps
  return <RLink {...rest} />
}
