import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact CalcNet for feedback, corrections, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Have feedback, found a bug, or want to suggest a new calculator?
        We&apos;d love to hear from you.
      </p>
      <form className="mt-8 space-y-4" action="mailto:support@calcnet.example" method="post">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input id="name" name="name" type="text" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">Message</label>
          <textarea id="message" name="message" rows={5} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800" />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">Send Message</button>
      </form>
    </div>
  );
}
