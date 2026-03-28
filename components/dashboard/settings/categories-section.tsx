"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Edit2, Trash, Category, Add } from "iconsax-reactjs";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Section } from "@/components/dashboard/settings";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

const COLOR_PALETTE = [
  "#E50914",
  "#F97316",
  "#F59E0B",
  "#22C55E",
  "#10B981",
  "#1DB954",
  "#0EA5E9",
  "#3478F6",
  "#6366F1",
  "#A259FF",
  "#EC4899",
  "#64748B",
];

// ── Add / Edit modal ──────────────────────────────────────────
function CategoryFormModal({
  initial,
  onSave,
  onClose,
  isSaving,
}: {
  initial: { name: string; color: string };
  onSave: (values: { name: string; color: string }) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial.name);
  const [color, setColor] = useState(initial.color);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5 shadow-xl">
        <h3 className="text-base font-black text-foreground">
          {initial.name ? "Edit category" : "New category"}
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full bg-neutral border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-primary/50 transition-colors"
            placeholder="e.g. Design Tools"
            maxLength={30}
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "w-7 h-7 rounded-full transition-all",
                  color === c
                    ? "ring-2 ring-offset-2 ring-offset-surface scale-110"
                    : "hover:scale-105"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ name: name.trim(), color })}
            disabled={!name.trim() || isSaving}
            className="flex-1 h-11 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View all modal ────────────────────────────────────────────
function ViewAllModal({
  customCategories,
  onAdd,
  onEdit,
  onDelete,
  onClose,
  deletingId,
}: {
  customCategories: Array<{
    _id: Id<"categories">;
    name: string;
    color: string;
  }>;
  onAdd: () => void;
  onEdit: (cat: { id: Id<"categories">; name: string; color: string }) => void;
  onDelete: (id: Id<"categories">) => void;
  onClose: () => void;
  deletingId: Id<"categories"> | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-sm flex flex-col shadow-xl max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <p className="text-sm font-black tracking-widest uppercase text-foreground">
            All Categories
          </p>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Add size={13} color="#fff" />
            Add New
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex flex-col gap-1.5 p-4">
          {/* Defaults — read-only */}
          {DEFAULT_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm font-bold text-foreground flex-1">
                {cat.name}
              </span>
              <span className="text-[10px] font-semibold text-muted/50 uppercase tracking-widest">
                Default
              </span>
            </div>
          ))}

          {/* Custom — editable */}
          {customCategories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral group"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm font-bold text-foreground flex-1">
                {cat.name}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    onEdit({ id: cat._id, name: cat.name, color: cat.color })
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-border/50 transition-colors"
                >
                  <Edit2 size={13} color="var(--color-muted)" />
                </button>
                <button
                  onClick={() => onDelete(cat._id)}
                  disabled={deletingId === cat._id}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-tertiary/10 transition-colors disabled:opacity-50"
                >
                  <Trash size={13} color="var(--color-tertiary)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
type FormModal =
  | { mode: "add" }
  | { mode: "edit"; id: Id<"categories">; name: string; color: string }
  | null;

export function CategoriesSection() {
  const customCategories = useQuery(api.categories.getCategories);
  const createCategory = useMutation(api.categories.createCategory);
  const updateCategory = useMutation(api.categories.updateCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);

  const [viewAll, setViewAll] = useState(false);
  const [formModal, setFormModal] = useState<FormModal>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<Id<"categories"> | null>(null);

  const totalCount =
    DEFAULT_CATEGORIES.length + (customCategories?.length ?? 0);
  const previewItems = DEFAULT_CATEGORIES.slice(0, 4);

  async function handleSave(values: { name: string; color: string }) {
    setIsSaving(true);
    try {
      if (formModal?.mode === "add") {
        await createCategory(values);
        toast.success("Category created");
      } else if (formModal?.mode === "edit") {
        await updateCategory({ id: formModal.id, ...values });
        toast.success("Category updated");
      }
      setFormModal(null);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: Id<"categories">) {
    setDeletingId(id);
    try {
      await deleteCategory({ id });
      toast.success("Category deleted");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const formInitial =
    formModal?.mode === "edit"
      ? { name: formModal.name, color: formModal.color }
      : { name: "", color: COLOR_PALETTE[0] };

  return (
    <>
      <Section
        icon={Category}
        title="Categories"
        action={
          <button
            onClick={() => setFormModal({ mode: "add" })}
            className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-primary hover:opacity-80 transition-opacity"
          >
            + Add New
          </button>
        }
      >
        <div className="flex flex-col gap-2">
          {previewItems.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm font-bold text-foreground">
                {cat.name}
              </span>
            </div>
          ))}

          <button
            onClick={() => setViewAll(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border text-xs font-bold tracking-widest uppercase text-muted hover:text-foreground hover:border-border/80 transition-colors"
          >
            View all {totalCount}
          </button>
        </div>
      </Section>

      {viewAll && customCategories !== undefined && (
        <ViewAllModal
          customCategories={customCategories}
          onAdd={() => setFormModal({ mode: "add" })}
          onEdit={(cat) => setFormModal({ mode: "edit", ...cat })}
          onDelete={handleDelete}
          onClose={() => setViewAll(false)}
          deletingId={deletingId}
        />
      )}

      {formModal && (
        <CategoryFormModal
          initial={formInitial}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
