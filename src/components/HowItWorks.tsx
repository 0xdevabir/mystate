"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Username.",
    description:
      "Enter your GitHub handle. We pull your live stats — stars, repos, followers, and top languages.",
  },
  {
    num: "02",
    title: "Template.",
    description:
      "Browse nine distinct card designs. Each one previews with your real data before you commit.",
  },
  {
    num: "03",
    title: "Embed.",
    description:
      "Copy a single markdown line into your README. Your stats update automatically from our servers.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-dark px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-accent">
            How It Works
          </p>
          <h2 className="mb-16 text-[36px] font-black leading-none text-bg sm:text-[48px] md:text-[56px]">
            Three steps.
          </h2>
        </motion.div>

        <div className="flex flex-col divide-y divide-bg/10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="grid grid-cols-1 items-center gap-6 py-10 md:grid-cols-[120px_1fr_1fr]">
                <span className="text-[13px] font-bold uppercase tracking-widest text-bg/25">
                  {step.num}
                </span>
                <h3
                  className={`text-[40px] font-black leading-none sm:text-[52px] md:text-[64px] ${
                    i === 1 ? "text-accent" : "text-bg"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="max-w-sm text-[15px] leading-relaxed text-bg/55">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
