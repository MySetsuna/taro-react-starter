export interface IWechatLoginParams {
  readonly clientId: string
  readonly grantType: 'xcx'
  readonly tenantId: '000000'
  readonly code: ''
  readonly uuid: ''
  readonly appid: string
  readonly xcxCode: string
  readonly userType: 'app_user'
  readonly [key: string]: any
}

export interface IWechatLoginOptions {
  readonly data: IWechatLoginParams
  readonly method: 'POST'
}

export interface ISMSLoginOptions {
  readonly data: ISMSLoginParams
  readonly method: 'POST'
}

export interface ISMSLoginParams {
  readonly clientId: string
  readonly grantType: 'sms'
  readonly tenantId: '000000'
  readonly code: ''
  readonly uuid: ''
  readonly appid: string
  readonly phonenumber: string
  readonly smsCode: string
  readonly userType: 'app_user'
  readonly [key: string]: any
}

export interface ILoginInfo {
  readonly scope: string
  readonly openid: string
  readonly access_token: string
  readonly refresh_token: string
  readonly expire_in: number
  readonly refresh_expire_in: number
  readonly client_id: string
}
