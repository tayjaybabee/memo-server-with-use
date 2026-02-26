import { Lock } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'

interface AccessDeniedProps {
  username: string
}

export function AccessDenied({ username }: AccessDeniedProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock size={40} weight="duotone" className="text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Access Restricted
        </h1>
        
        <p className="text-muted-foreground mb-2">
          Sorry <span className="font-semibold text-foreground">{username}</span>, you don't have access to this memo server.
        </p>
        
        <p className="text-sm text-muted-foreground">
          Contact the server owner to request access.
        </p>
      </Card>
    </div>
  )
}
