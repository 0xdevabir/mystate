"use client";

import { motion } from "framer-motion";
import { User, Palette, Copy } from "lucide-react";

const steps = [
  {
    icon: User,
    title: "Enter username",
    description: "Type your GitHub username to pull your live stats",
  },
  {
    icon: Palette,
    title: "Pick a template",
    description: "Browse 9 unique designs with real-time previews",
  },
  {
    icon: Copy,
    title: "Copy & paste",
    description: "One line of code into your README — done",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
              <step.icon className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="font-medium text-white">{step.title}</h3>
            <p className="mt-1.5 text-sm text-zinc-500">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
