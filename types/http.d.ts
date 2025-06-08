import { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface IResponse {
  readonly code: number
  readonly msg: string
}

export interface IDataResponse<T = any> extends IResponse {
  readonly data: T
}

export interface IRowsResponse<T = any> extends IResponse {
  readonly rows: ReadonlyArray<T>
  readonly total: number
}

type IRequestOptionsWithType<T = any> = IRequestOptions &
  (
    | {
        method: 'GET'
        params: T
      }
    | {
        method: 'POST'
        data: T
      }
    | {
        method: Exclude<AxiosRequestConfig['method'], 'GET' | 'POST'>
        [key: string]: any
      }
  )

export interface IRequest {
  <T, M extends IRequestOptionsWithType = any>(url: string, opts?: Omit<IRequestOptions, 'method'> & M): Promise<T>
}

export type RequestError = AxiosError | Error

export interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean
  getResponse?: boolean
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
  [key: string]: any
}

export interface IUpload<T = any, D = any> {
  (url: string, data: D, opts?: IRequestOptions): Promise<T>
}

export interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void
}

export type IRequestInterceptor = (
  config: IRequestOptions & InternalAxiosRequestConfig
) => IRequestOptions & InternalAxiosRequestConfig

export type IResponseInterceptor = (response: AxiosResponse) => AxiosResponse

export type IErrorInterceptor = (error: AxiosError) => Promise<AxiosError>

export type IRequestInterceptorTuple =
  | [IRequestInterceptor, IErrorInterceptor]
  | [IRequestInterceptor]
  | IRequestInterceptor

export type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor

export interface RequestConfig<T = any> extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: IErrorHandler
    errorThrower?: (res: T) => void
  }
  requestInterceptors?: IRequestInterceptorTuple[]
  responseInterceptors?: IResponseInterceptorTuple[]
}
