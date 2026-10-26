"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export interface TimelineProps {
  data: TimelineEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  id?: string;
  className?: string;
}

export const Timeline = ({
  data,
  title,
  description,
  eyebrow,
  id = "journey-milestones",
  className = "",
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && ref.current) {
      resizeObserver = new ResizeObserver(() => updateHeight());
      resizeObserver.observe(ref.current);
    }

    return () => {
      window.removeEventListener("resize", updateHeight);
      resizeObserver?.disconnect();
    };
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section
      id={id}
      className={`w-full bg-[#f8f9fb] dark:bg-[#05080e] font-sans md:px-10 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 ${className}`}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        {eyebrow && (
          <span className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-3 inline-block">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-[#0b192c] dark:text-white max-w-4xl tracking-tight leading-[1.15]">
          {typeof title === "string" ? (
            title.includes("&") ? (
              <>
                {title.split("&")[0]} &{" "}
                <span className="italic font-normal font-serif text-blue-600 dark:text-blue-400">
                  {title.split("&")[1]?.trim()}
                </span>
              </>
            ) : (
              title
            )
          ) : (
            title || "Changelog from my journey"
          )}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed font-normal">
          {description ||
            "Every step in our journey reflects our growth as a trusted consulting partner."}
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-36 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800 flex items-center justify-center shadow-xs">
                <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-500 dark:border-blue-400 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl lg:text-4xl font-serif font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-serif font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-slate-200 dark:via-slate-800 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-600 via-indigo-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </section>
  );
};
