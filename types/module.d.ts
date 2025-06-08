
export interface ICategory {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly sort: number
  readonly status: string
}

export interface IFactory {
  readonly id: number
  readonly tenantId: string
  readonly tenantType: string
  readonly contactUserName: string
  readonly contactPhone: string
  readonly companyName: string
  readonly licenseNumber: string
  readonly industryCategories: string
  readonly intro: string
  readonly provinceId: number
  readonly cityId: number
  readonly districtId: number
  readonly province: string
  readonly city: string
  readonly district: string
  readonly address: string
  readonly logo: string
  readonly logoUrl: string
  readonly backgroundImage: string
  readonly backgroundImageUrl: string
  readonly domain: string
  readonly remark: string
  readonly packageId: number
  readonly expireTime: Date
  readonly accountCount: number
  readonly status: string
  //租户分类/产品分类
  readonly tenantCategoryList: ReadonlyArray<ICategory>
}

export interface IAreaItem {
  id: number
  name: string
  parentId: number
  tag: string
  value: number
  label: string
  children?: Array<IAreaItem>
}

export type TAreaTree = IAreaItem
