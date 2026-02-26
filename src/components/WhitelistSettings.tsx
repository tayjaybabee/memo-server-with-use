import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash, UserPlus } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface WhitelistSettingsProps {
  whitelist: string[]
  onUpdateWhitelist: (whitelist: string[]) => void
}

export function WhitelistSettings({ whitelist, onUpdateWhitelist }: WhitelistSettingsProps) {
  const [newUsername, setNewUsername] = useState('')

  const handleAddUsername = () => {
    const username = newUsername.trim()
    
    if (!username) {
      toast.error('Please enter a username')
      return
    }

    if (whitelist.includes(username)) {
      toast.error('This username is already whitelisted')
      return
    }

    onUpdateWhitelist([...whitelist, username])
    setNewUsername('')
    toast.success(`Added ${username} to whitelist`)
  }

  const handleRemoveUsername = (username: string) => {
    onUpdateWhitelist(whitelist.filter(u => u !== username))
    toast.success(`Removed ${username} from whitelist`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddUsername()
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserPlus size={20} weight="duotone" className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Whitelist Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage who can access this memo server
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            id="new-username"
            type="text"
            placeholder="Enter GitHub username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAddUsername} className="bg-accent hover:bg-accent/90">
            <Plus size={18} weight="bold" className="mr-2" />
            Add
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">
              Whitelisted Users
            </h3>
            <Badge variant="secondary">
              {whitelist.length} {whitelist.length === 1 ? 'user' : 'users'}
            </Badge>
          </div>

          {whitelist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No users whitelisted</p>
              <p className="text-xs mt-1">Anyone can access this memo server</p>
            </div>
          ) : (
            <div className="space-y-2">
              {whitelist.map((username) => (
                <div
                  key={username}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors"
                >
                  <span className="font-medium text-foreground">{username}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveUsername(username)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
