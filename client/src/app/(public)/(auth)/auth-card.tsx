import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"

interface AuthCardProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
} 