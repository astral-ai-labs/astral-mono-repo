import { useMDXComponents } from "@/mdx-components"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const components = useMDXComponents({})

  return <div >{children}</div>
}