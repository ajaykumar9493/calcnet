interface PresetButtonsProps {
  presets: Array<{ label: string; values: Record<string, string | number> }>;
  onSelect: (values: Record<string, string | number>) => void;
}

export function PresetButtons({ presets, onSelect }: PresetButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onSelect(p.values)}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-600 dark:text-zinc-400"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
