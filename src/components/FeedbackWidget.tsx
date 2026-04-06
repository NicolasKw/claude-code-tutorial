"use client";

import { Dialog } from "@base-ui/react/dialog";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/app/actions/feedback";
import { getSessionId } from "@/lib/session";
import { cn } from "@/lib/utils";

type FeedbackType = "feedback" | "bug";

export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("feedback");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    const sessionId = getSessionId() ?? undefined;

    startTransition(async () => {
      const result = await submitFeedback({
        type,
        message: message.trim(),
        page: pathname,
        sessionId,
      });

      if (result.success) {
        setStatus("success");
        setMessage("");
        setTimeout(() => {
          setOpen(false);
          setStatus("idle");
        }, 1500);
      } else {
        setStatus("error");
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <button
            aria-label="Dar feedback"
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden>💬</span>
            Feedback
          </button>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup className="fixed bottom-20 right-5 z-50 w-80 rounded-xl border border-border bg-card p-5 shadow-xl data-[ending-style]:opacity-0 data-[ending-style]:translate-y-2 data-[starting-style]:opacity-0 data-[starting-style]:translate-y-2 transition-all duration-200">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-foreground">
              {status === "success"
                ? "¡Gracias por tu feedback!"
                : "¿Algo que decirnos?"}
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              }
            />
          </div>

          {status === "success" ? (
            <p className="text-sm text-muted-foreground">
              Tu mensaje fue recibido. Lo revisaremos pronto.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("feedback")}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    type === "feedback"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  💡 Sugerencia
                </button>
                <button
                  type="button"
                  onClick={() => setType("bug")}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    type === "bug"
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border text-muted-foreground hover:border-destructive/50"
                  )}
                >
                  🐛 Error
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === "bug"
                    ? "Describí qué pasó y cómo reproducirlo..."
                    : "¿Qué mejorarías o agregarías?"
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
                minLength={5}
                maxLength={1000}
              />

              {status === "error" && (
                <p className="text-xs text-destructive">
                  Algo salió mal. Intentá de nuevo.
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending || !message.trim()}
                className="w-full"
                size="sm"
              >
                {isPending ? "Enviando..." : "Enviar"}
              </Button>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
