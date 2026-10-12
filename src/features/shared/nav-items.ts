import type { Link, NavItem, Program } from "@/content/schemas";

export type NavItemView = {
  id: string;
  label: string;
  link: Link;
  /** Section on this page the item scrolls to (for active highlighting). */
  sectionId: string | null;
};

/**
 * Resolve nav/footer items: program references take the program's name and
 * scroll to its section; references to missing programs are skipped.
 */
export function resolveNavItems(
  items: readonly NavItem[],
  programs: readonly Program[],
): NavItemView[] {
  return items.flatMap((item): NavItemView[] => {
    if (item.kind === "program") {
      const program = programs.find((p) => p.id === item.programId);
      if (!program) return [];
      return [
        {
          id: `program-${program.id}`,
          label: program.name,
          link: { type: "anchor", target: program.id },
          sectionId: program.id,
        },
      ];
    }
    return [
      {
        id: `link-${item.label}`,
        label: item.label,
        link: item.link,
        sectionId: item.link.type === "anchor" ? item.link.target : null,
      },
    ];
  });
}
