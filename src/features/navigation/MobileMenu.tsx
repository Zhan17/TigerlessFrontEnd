"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type MouseEvent, useRef, useState } from "react";
import { CloseCircleIcon, LogoIcon, MenuIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/icon-button";
import { CtaButton } from "@/features/shared/CtaButton";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";
import { NavLink } from "./NavLink";
import type { NavigationProps } from "./to-navigation-props";

type MobileMenuProps = NavigationProps & {
  activeSectionId?: string | null;
  /** Start open (Storybook / tests). */
  defaultOpen?: boolean;
  className?: string;
};

// The panel grows out of the menu button (top-right) and collapses back.
const ORIGIN = "calc(100% - 1.75rem) 1.75rem";
const ease = [0.16, 1, 0.3, 1] as const; // --ease-out-expo

/**
 * Full-screen mobile menu (Radix Dialog: focus trap, Esc, scroll lock,
 * focus returns to the trigger). Motion: circular reveal from the top-right
 * button with the items sliding down; opacity only under reduced motion.
 */
export function MobileMenu({
  items,
  ctas,
  activeSectionId = null,
  defaultOpen = false,
  className,
}: MobileMenuProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  // Anchor to scroll to once the menu has closed and the scroll lock is gone.
  const pendingTarget = useRef<string | null>(null);

  const onItemClick = (
    event: MouseEvent<HTMLElement>,
    sectionId: string | null,
  ) => {
    if (!sectionId) return; // no destination: press feedback only
    event.preventDefault();
    pendingTarget.current = sectionId;
    setOpen(false);
  };

  const onExitComplete = () => {
    const id = pendingTarget.current;
    pendingTarget.current = null;
    if (!id) return;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  const panel = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { clipPath: `circle(0% at ${ORIGIN})` },
        animate: { clipPath: `circle(150% at ${ORIGIN})` },
        exit: { clipPath: `circle(0% at ${ORIGIN})` },
      };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton
          label={uiCopy.menu.open}
          icon={MenuIcon}
          tone="plain"
          size="sm"
          className={className}
        />
      </Dialog.Trigger>
      <AnimatePresence onExitComplete={onExitComplete}>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-page/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-3 z-50 flex flex-col overflow-y-auto rounded-shell bg-surface px-2 pb-2 shadow-raised"
                {...panel}
                transition={{ duration: reduce ? 0.2 : 0.5, ease }}
              >
                <Dialog.Title className="sr-only">
                  {uiCopy.menu.title}
                </Dialog.Title>
                <div className="flex h-14 items-center justify-between border-b border-border px-3">
                  <LogoIcon className="h-8 w-[5.4375rem] text-heading" />
                  <Dialog.Close asChild>
                    <IconButton
                      label={uiCopy.menu.close}
                      icon={CloseCircleIcon}
                      tone="plain"
                      size="sm"
                    />
                  </Dialog.Close>
                </div>
                <motion.nav
                  aria-label={uiCopy.menu.title}
                  className="flex flex-1 flex-col"
                  initial={reduce ? false : { opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.15,
                    duration: 0.35,
                    ease,
                  }}
                >
                  <ul className="mt-14 flex flex-col items-center gap-2">
                    {items.map((item) => (
                      <li key={item.id}>
                        <NavLink
                          item={item}
                          size="lg"
                          active={
                            item.sectionId !== null &&
                            item.sectionId === activeSectionId
                          }
                          onClick={(event) =>
                            onItemClick(event, item.sectionId)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-14 flex flex-col gap-4">
                    {ctas.map((cta, index) => (
                      <CtaButton
                        key={cta.label}
                        cta={cta}
                        size="md"
                        fullWidth
                        variant={index === 0 ? "primary" : "outline"}
                        className={cn(index === 0 ? "" : "bg-surface")}
                      />
                    ))}
                  </div>
                </motion.nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
