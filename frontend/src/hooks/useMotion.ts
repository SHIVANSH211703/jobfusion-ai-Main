"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * usePageEntrance - GSAP page entrance animation
 * Subtle fade-in and upward slide of page container
 */
export function usePageEntrance<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * useStaggerReveal - GSAP staggered entrance for children
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  childSelector: string = ":scope > *",
  stagger: number = 0.06
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const children = el.querySelectorAll(childSelector);
      if (children.length > 0) {
        gsap.fromTo(
          children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger,
            ease: "power2.out",
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [childSelector, stagger]);

  return ref;
}

/**
 * useScrollReveal - GSAP intersection-based reveal for elements
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * useCountUp - GSAP numeric counter animation
 */
export function useCountUp(targetNumber: number, duration: number = 1.2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.textContent = targetNumber.toString();
      return;
    }

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: targetNumber,
      duration,
      ease: "power1.out",
      onUpdate: () => {
        if (el) el.textContent = Math.round(obj.val).toString();
      },
    });

    return () => {
      tween.kill();
    };
  }, [targetNumber, duration]);

  return ref;
}
