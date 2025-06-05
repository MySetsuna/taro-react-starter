import Taro from '@tarojs/taro'

export const MyLink = (props: React.HTMLAttributes<HTMLAnchorElement>) => {
  const env = Taro.getEnv()
  const isALIPAY = env === TaroGeneral.ENV_TYPE.ALIPAY
  const rest = {
    ...props,
    as: isALIPAY ? 'view' : undefined,
  } as React.HTMLAttributes<HTMLAnchorElement>
  return <a {...rest} />
}
