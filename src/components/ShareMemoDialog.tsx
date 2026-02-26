import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, UserPlus } from '@phosphor-icons/react'
import type { Memo } from '@/types/memo'

interface ShareMemoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memo: Memo | null
  onShare: (memoId: string, sharedWith: string[]) => void
}

export function ShareMemoDialog({ open, onOpenChange, memo, onShare }: ShareMemoDialogProps) {
  const [username, setUsername] = useState('')
  const [sharedUsers, setSharedUsers] = useState<string[]>(memo?.sharedWith || [])

  const handleAddUser = () => {
    const trimmedUsername = username.trim()
    if (trimmedUsername && !sharedUsers.includes(trimmedUsername)) {
      setSharedUsers([...sharedUsers, trimmedUsername])
      setUsername('')
    }
  }

  const handleRemoveUser = (userToRemove: string) => {
    setSharedUsers(sharedUsers.filter(user => user !== userToRemove))
  }

  const handleSave = () => {
    if (memo) {
      onShare(memo.id, sharedUsers)
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddUser()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (isOpen && memo) {
        setSharedUsers(memo.sharedWith || [])
        setUsername('')
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <UserPlus size={24} />
            Share Memo
          </DialogTitle>
          <DialogDescription>
            Share "{memo?.title}" with specific GitHub users
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="github-username">GitHub Username</Label>
            <div className="flex gap-2">
              <Input
                id="github-username"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                type="button" 
                onClick={handleAddUser}
                className="bg-accent hover:bg-accent/90"
              >
                <UserPlus size={18} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or click the button to add a user
            </p>
          </div>

          {sharedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Shared with ({sharedUsers.length})</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border border-border min-h-[60px]">
                {sharedUsers.map(user => (
                  <Badge 
                    key={user} 
                    variant="secondary"
                    className="gap-1 pr-1 text-sm"
                  >
                    {user}
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {sharedUsers.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              This memo is not shared with anyone yet
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
