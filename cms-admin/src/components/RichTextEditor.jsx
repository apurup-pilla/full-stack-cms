import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, IconButton, Tooltip, Divider } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import TitleIcon from '@mui/icons-material/Title';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

function ToolbarButton({ title, onClick, active, children }) {
  return (
    <Tooltip title={title}>
      <IconButton
        size="small"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        color={active ? 'primary' : 'default'}
        sx={{ borderRadius: 1 }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your page content here…' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap',
          gap: 0.25, p: 0.75, bgcolor: 'grey.50',
          borderBottom: '1px solid', borderColor: 'divider',
        }}
      >
        <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <FormatBoldIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <FormatItalicIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
          <FormatStrikethroughIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')}>
          <CodeIcon fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
          <TitleIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <TitleIcon sx={{ fontSize: 15 }} />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <FormatListBulletedIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <FormatListNumberedIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <FormatQuoteIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>
          <CodeIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false}>
          <HorizontalRuleIcon fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} active={false}>
          <UndoIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} active={false}>
          <RedoIcon fontSize="small" />
        </ToolbarButton>
      </Box>

      <Box
        sx={{
          minHeight: 320, p: 2,
          '& .ProseMirror': {
            outline: 'none', minHeight: 300, fontSize: 14, lineHeight: 1.7,
            '& h1': { fontSize: '1.75em', fontWeight: 700, mt: 1.5, mb: 0.5 },
            '& h2': { fontSize: '1.35em', fontWeight: 600, mt: 1.5, mb: 0.5 },
            '& p': { mb: 1 },
            '& ul, & ol': { pl: 3, mb: 1 },
            '& li': { mb: 0.25 },
            '& blockquote': {
              borderLeft: '3px solid #cbd5e1', pl: 2, ml: 0,
              color: 'text.secondary', fontStyle: 'italic',
            },
            '& code': {
              bgcolor: '#f1f5f9', px: 0.5, py: 0.25, borderRadius: 0.5,
              fontFamily: 'monospace', fontSize: 13,
            },
            '& pre': {
              bgcolor: '#1e293b', color: '#e2e8f0', p: 2,
              borderRadius: 1, overflow: 'auto', mb: 1,
              '& code': { bgcolor: 'transparent', color: 'inherit', p: 0 },
            },
            '& hr': { border: 'none', borderTop: '2px solid #e2e8f0', my: 2 },
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              float: 'left', color: '#94a3b8',
              pointerEvents: 'none', height: 0,
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
