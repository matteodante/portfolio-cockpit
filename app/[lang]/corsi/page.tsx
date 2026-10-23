import { coursesRoute } from '@/components/courses/courses-route'

const route = coursesRoute('it')

export const dynamicParams = false
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
