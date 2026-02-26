import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, User } from '@phosphor-icons/react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  userLogin: string
  avatarUrl: string
}

export function Header({ searchQuery, onSearchChange, userLogin, avatarUrl }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Memo Server
              </h1>
              {userLogin && (
                <p className="text-sm text-muted-foreground">
                  Welcome, {userLogin}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 sm:flex-none sm:w-80">
              <MagnifyingGlass 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                size={18}
              />
              <Input
                type="text"
                placeholder="Search memos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            {userLogin && (
              <Avatar className="hidden sm:block border-2 border-primary/20">
                <AvatarImage src={avatarUrl} alt={userLogin} />
                <AvatarFallback>
                  <User weight="fill" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
