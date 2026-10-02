import Image from "next/image";
import { CallIcon, ChevronLeftIcon, VideoIcon } from "@/components/icons";
import type { Image as ImageData, ServiceMedia } from "@/content/schemas";
import { cn } from "@/lib/cn";

type Chat = Extract<ServiceMedia, { kind: "chat" }>["chat"];

type Props = {
  chat: Chat;
  className?: string;
};

function Avatar({ image, className }: { image: ImageData; className: string }) {
  return (
    <span className={cn("relative shrink-0", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="size-full rounded-full object-cover"
      />
      {/* Online dot */}
      <span className="absolute right-0 bottom-0 size-1.25 rounded-full bg-green-500 ring-1 ring-white" />
    </span>
  );
}

/**
 * The chat bubble panel over the phone in the "24/7 Provider Support" card.
 * Drawn in code from data (provider, status, messages) rather than baked
 * into the image, so the conversation can change and stays real text.
 * Sizes follow the board (an illustration of the app at phone scale).
 */
export function ChatPreview({ chat, className }: Props) {
  return (
    <div
      className={cn(
        "w-55 overflow-hidden rounded-panel bg-chat-panel text-heading-strong shadow-soft",
        className,
      )}
    >
      <div className="flex h-10.5 items-center justify-between px-2.5">
        <div className="flex items-center gap-1.75">
          <ChevronLeftIcon className="size-3.5 text-muted" />
          <Avatar image={chat.providerAvatar} className="size-7" />
          <div>
            <p className="text-chat-title font-medium">{chat.providerName}</p>
            <p className="text-chat-meta text-accent">{chat.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <CallIcon className="size-3.5" />
          <VideoIcon className="size-3.5" />
        </div>
      </div>

      <div className="flex h-4.5 items-center gap-3 px-2">
        <span className="h-px flex-1 bg-border" />
        <span className="text-chat-meta text-muted">{chat.dayLabel}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <ul className="flex flex-col gap-3 px-2.5 pt-1 pb-2.5">
        {chat.messages.map((message) =>
          message.from === "provider" ? (
            <li key={message.id} className="flex items-end gap-1.75">
              <Avatar image={chat.providerAvatar} className="size-4.5" />
              <div className="flex-1 rounded-bubble bg-white/80 p-1.5">
                <p className="text-chat-meta text-muted">{chat.providerName}</p>
                <p className="mt-0.5 text-chat">{message.text}</p>
                <p className="mt-1 text-right text-chat-meta">{message.time}</p>
              </div>
            </li>
          ) : (
            <li
              key={message.id}
              className="ml-6.5 rounded-bubble bg-brand-900 p-1.5 text-white"
            >
              <p className="text-chat">{message.text}</p>
              <p className="mt-1 text-right text-chat-meta opacity-80">
                {message.time}
              </p>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
