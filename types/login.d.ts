export interface IWechatLoginParams {
  readonly clientId: 'be7052a7e4f802c20df10a8d131adb12'
  readonly grantType: 'xcx'
  readonly tenantId: '000000'
  readonly code: ''
  readonly uuid: ''
  readonly appid: 'wxda63215f19af7717'
  readonly xcxCode: string
  readonly userType: 'app_user'
}

export interface IWechatLoginOptions {
  readonly data: IWechatLoginParams
  readonly method: 'POST'
}

export interface ISMSLoginParams {
  readonly clientId: 'be7052a7e4f802c20df10a8d131adb12'
  readonly grantType: 'sms'
  readonly tenantId: '000000'
  readonly code: ''
  readonly uuid: ''
  readonly appid: 'wxda63215f19af7717'
  readonly phonenumber: '17872612922'
  readonly smsCode: string
  readonly userType: 'app_user'
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
