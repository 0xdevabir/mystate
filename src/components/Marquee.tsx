import { TEMPLATE_LIST } from "@/lib/templates";

const items = [
  "GitHub Stats",
  "README Cards",
  "Live Previews",
  `${TEMPLATE_LIST.length} Templates`,
  "One-Line Embed",
  "Open Source",
  "Developer Tools",
  "Profile Badges",
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-dark py-5">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-5 px-5 text-[13px] font-bold uppercase tracking-[0.2em] text-bg/50"
          >
            {item}
            <span className="text-[18px] text-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

