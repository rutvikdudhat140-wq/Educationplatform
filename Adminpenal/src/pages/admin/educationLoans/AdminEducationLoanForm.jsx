import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link as TiptapLink } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const INITIAL_FORM = {
  title: '',
  slug: '',
  summary: '',
  category: 'Education Loan Guides',
  country: '',
  coverImage: '',
  status: 'draft',
  content: { type: 'doc', content: [{ type: 'paragraph' }] },
};

const FIELDS = Object.keys(INITIAL_FORM);

const SLUG_GROUPS = [
  {
    label: 'Main Guide Tabs',
    options: [
      ['step-by-step-guide', 'Overview (Step by Step)'],
      ['eligibility-criteria', 'Loan Eligibility'],
      ['best-education-loan-providers', 'Loan Providers'],
      ['public-vs-private', 'Public v/s Private'],
      ['government-loans', 'Government Loans'],
      ['vidya-laxmi-portal', 'Vidya Laxmi Portal'],
      ['loan-calculator', 'Loan Calculator'],
      ['interest-rates', 'Education Loan Interest Rates'],
    ],
  },
  {
    label: 'Other Guides',
    options: [
      ['documents-required', 'Documents Required for Loan'],
      ['student-loan-vs-self-finance', 'Student Loan Vs Self Finance'],
      ['collateral-for-education-loan', 'Collateral for Education Loan'],
      ['apply-abroad', 'Apply Education Loan for Abroad'],
    ],
  },
  
];

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany'];

const fieldClass =
  'w-full rounded-md border border-line-strong bg-white p-2 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none';

const Divider = () => (
  <div className="mx-1 my-auto h-6 w-px bg-slate-300" />
);

const ToolButton = ({ active, disabled, title, onClick, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`rounded p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-40 ${
      active
        ? 'bg-brand-soft text-ink'
        : 'text-ink-muted hover:bg-brand-soft'
    }`}
  >
    {children}
  </button>
);

const MenuBar = ({ editor, onPickUrl }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b bg-surface p-2">
      <ToolButton
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolButton>

      <ToolButton
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolButton>

      <ToolButton
        title="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </ToolButton>

      <Divider />

      {[1, 2, 3].map((level) => (
        <ToolButton
          key={level}
          title={`Heading ${level}`}
          active={editor.isActive('heading', { level })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level }).run()
          }
        >
          <span className="text-xs font-bold">H{level}</span>
        </ToolButton>
      ))}

      <Divider />

      <ToolButton
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolButton>

      <ToolButton
        title="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolButton>

      <ToolButton
        title="Quote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolButton>

      <Divider />

      <ToolButton title="Insert image" onClick={() => onPickUrl('image')}>
        <ImageIcon size={16} />
      </ToolButton>

      <ToolButton
        title="Insert link"
        active={editor.isActive('link')}
        onClick={() => onPickUrl('link')}
      >
        <LinkIcon size={16} />
      </ToolButton>

      <ToolButton
        title="Remove link"
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Unlink size={16} />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo size={16} />
      </ToolButton>

      <ToolButton
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo size={16} />
      </ToolButton>
    </div>
  );
};

export default function AdminEducationLoanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [urlDialog, setUrlDialog] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      TiptapLink.configure({ openOnClick: false }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: INITIAL_FORM.content,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none min-h-[380px] p-4 outline-none focus:outline-none',
      },
    },
    onUpdate: ({ editor: instance }) => {
      setFormData((prev) => ({ ...prev, content: instance.getJSON() }));
    },
  });

  useEffect(() => {
    if (!id || !editor) return;

    const controller = new AbortController();

    const loadArticle = async () => {
      try {
        const res = await axios.get(
          `/api/education-loan/articles/id/${id}`,
          { signal: controller.signal }
        );

        const next = { ...INITIAL_FORM };

        FIELDS.forEach((field) => {
          if (res.data[field] !== undefined) next[field] = res.data[field];
        });

        setFormData(next);

        if (res.data.content) {
          editor.commands.setContent(res.data.content);
        }
      } catch {}
    };

    loadArticle();

    return () => controller.abort();
  }, [id, editor]);

  const update = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openUrlDialog = (mode) => {
    setUrlDialog({
      mode,
      value: mode === 'image' ? '' : editor?.getAttributes('link').href || '',
    });
  };

  const applyUrl = () => {
    const value = urlDialog.value.trim();

    if (urlDialog.mode === 'image') {
      if (value) editor.chain().focus().setImage({ src: value }).run();
    } else if (value) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: value })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }

    setUrlDialog(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await (isEdit
        ? axios.put(
            `/api/education-loan/articles/${id}`,
            formData
          )
        : axios.post(
            '/api/education-loan/articles',
            formData
          ));

      navigate('/admin/education-loans');
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-ink">
          {isEdit ? 'Edit Guide' : 'Write New Guide'}
        </h2>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/education-loans')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="education-loan-form"
            className="bg-brand hover:bg-brand-dark"
          >
            Save Guide
          </Button>
        </div>
      </div>

      <form
        id="education-loan-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-line bg-white p-4">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Article Title
            </label>

            <Input
              className="py-5 text-base"
              placeholder="e.g. A Step-by-Step Guide to Apply For an Education Loan"
              value={formData.title}
              onChange={update('title')}
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <MenuBar editor={editor} onPickUrl={openUrlDialog} />
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-xl border border-line bg-white p-4">
          <h3 className="border-b pb-2 text-sm font-semibold text-ink">
            Publish Settings
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-muted">
              Target Section / Slug
            </label>

            <select
              className={fieldClass}
              value={formData.slug}
              onChange={update('slug')}
            >
              <option value="">-- Select Target Section --</option>

              {SLUG_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <Input
              className="mt-2"
              placeholder="Or type custom slug..."
              value={formData.slug}
              onChange={update('slug')}
            />

            <p className="mt-1 text-xs text-ink-muted">
              Pick a tab to link it directly, or type a custom slug.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-muted">
              Category
            </label>

            <select
              className={fieldClass}
              value={formData.category}
              onChange={update('category')}
            >
              <option value="Education Loan Guides">
                Education Loan Guides
              </option>
              <option value="Guide for Countries">
                Guide for Countries
              </option>
            </select>
          </div>

          {formData.category === 'Guide for Countries' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-muted">
                Country
              </label>

              <select
                className={fieldClass}
                value={formData.country}
                onChange={update('country')}
              >
                <option value="">Select Country</option>

                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-muted">
              Cover Image URL
            </label>

            <Input
              placeholder=""
              value={formData.coverImage}
              onChange={update('coverImage')}
            />

            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover Preview"
                className="mt-2 h-32 w-full rounded-md object-cover shadow-sm"
              />
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-muted">
              Short Summary (For Blog List)
            </label>

            <textarea
              className={fieldClass}
              rows={4}
              placeholder="Brief summary of the article..."
              value={formData.summary}
              onChange={update('summary')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink-muted">
              Status
            </label>

            <select
              className={fieldClass}
              value={formData.status}
              onChange={update('status')}
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Public)</option>
            </select>
          </div>
        </div>
      </form>

      <Dialog
        open={!!urlDialog}
        onOpenChange={(open) => !open && setUrlDialog(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              {urlDialog?.mode === 'image' ? 'Insert image' : 'Insert link'}
            </DialogTitle>
          </DialogHeader>

          <Input
            autoFocus
            placeholder="https://..."
            value={urlDialog?.value || ''}
            onChange={(event) =>
              setUrlDialog((prev) => ({ ...prev, value: event.target.value }))
            }
            onKeyDown={(event) => event.key === 'Enter' && applyUrl()}
          />

          {urlDialog?.mode === 'link' && (
            <p className="text-xs text-ink-muted">
              Leave empty and save to remove the link.
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUrlDialog(null)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              onClick={applyUrl}
              className="bg-brand hover:bg-brand-dark"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
