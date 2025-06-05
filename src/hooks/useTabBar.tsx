import { TabBar } from '@/tab-bar'

export const useTabBar = (Component: React.FC) => {
  const wrappedComponent = (props: any = {}) => {
    return (
      <>
        <Component {...props} />
        <TabBar />
      </>
    )
  }
  return wrappedComponent
}
