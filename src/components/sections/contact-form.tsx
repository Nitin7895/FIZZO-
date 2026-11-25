"use client";

import { useState, type FormEvent } from "react";

import { Spring } from "@/components/common/robot-spring";
import { Button } from "@/components/ui/button";
import { ApiClientError, apiFetch } from "@/lib/api-client";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-[1rem] border border-surface-border bg-surface px-[1.2rem] py-[0.9rem] text-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-entrance placeholder:text-muted focus:border-accent";

export const ContactForm = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      await apiFetch<{ received: boolean }>("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
        }),
      });
      form.reset();
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <Spring
        tag="div"
        mode="once"
        from={{ opacity: 0, scale: 0.94 }}
        to={{ opacity: 1, scale: 1 }}
        className="rounded-card border border-surface-border bg-surface p-[2.4rem] text-center"
      >
        <p className="font-display uppercase tracking-tight text-[3rem] leading-display text-accent">Thanks — message received!</p>
        <p className="mt-[0.6rem] text-muted">We will get back to you faster than a can goes warm.</p>
      </Spring>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-[1rem]" noValidate>
      <label className="block">
        <span className="mb-[0.3rem] block text-[0.9rem] text-muted">Name</span>
        <input name="name" required maxLength={100} autoComplete="name" className={field} placeholder="Your name" />
      </label>
      <label className="block">
        <span className="mb-[0.3rem] block text-[0.9rem] text-muted">Email</span>
        <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
      </label>
      <label className="block">
        <span className="mb-[0.3rem] block text-[0.9rem] text-muted">Message</span>
        <textarea name="message" required maxLength={2000} rows={5} className={field} placeholder="Tell us your favorite flavor…" />
      </label>
      {status === "error" && (
        <p role="alert" className="text-accent">
          {error}
        </p>
      )}
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
};
