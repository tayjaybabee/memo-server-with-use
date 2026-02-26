import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  TextB, 
  TextItalic, 
  TextStrikethrough, 
  Code, 
  ListBullets, 
  ListNumbers, 
  Quotes, 
  Link as LinkIcon,
  Eye,
  PencilSimple
} from '@phosphor-icons/react'
import { marked } from 'marked'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const beforeText = value.substring(0, start)
    const afterText = value.substring(end)

    const newText = beforeText + before + selectedText + after + afterText
    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatButtons = [
    { icon: TextB, action: () => insertMarkdown('**', '**'), label: 'Bold' },
    { icon: TextItalic, action: () => insertMarkdown('*', '*'), label: 'Italic' },
    { icon: TextStrikethrough, action: () => insertMarkdown('~~', '~~'), label: 'Strikethrough' },
    { icon: Code, action: () => insertMarkdown('`', '`'), label: 'Inline Code' },
    { icon: ListBullets, action: () => insertMarkdown('\n- '), label: 'Bullet List' },
    { icon: ListNumbers, action: () => insertMarkdown('\n1. '), label: 'Numbered List' },
    { icon: Quotes, action: () => insertMarkdown('\n> '), label: 'Quote' },
    { icon: LinkIcon, action: () => insertMarkdown('[', '](url)'), label: 'Link' },
  ]

  const renderMarkdown = (text: string) => {
    try {
      return marked(text, { 
        breaks: true,
        gfm: true
      }) as string
    } catch (e) {
      return text
    }
  }

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="write" className="gap-2">
              <PencilSimple size={16} />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye size={16} />
              Preview
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'write' && (
            <div className="flex gap-1 flex-wrap">
              {formatButtons.map((btn, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={btn.action}
                  title={btn.label}
                >
                  <btn.icon size={18} />
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            id="content-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={14}
            className="resize-none font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="border border-input rounded-lg p-4 min-h-[336px] bg-background">
            {value ? (
              <div 
                className="prose prose-sm max-w-none prose-headings:font-heading prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-blockquote:text-muted-foreground prose-code:text-accent prose-pre:bg-secondary prose-a:text-accent"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
              />
            ) : (
              <p className="text-muted-foreground text-sm">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <p className="text-xs text-muted-foreground">
        Supports Markdown: **bold**, *italic*, ~~strikethrough~~, `code`, lists, links, and more
      </p>
    </div>
  )
}
