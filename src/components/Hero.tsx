"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);
    
    const video = videoRef.current;
    if (!video) return;

    // Real Loading State
    document.body.style.overflow = "hidden";

    const setupScrollTrigger = () => {
      setIsLoaded(true);
      document.body.style.overflow = "";

      if (prefersReducedMotion) {
        // Graceful degradation: No pinning, no video scrubbing, just fade out text on scroll
        gsap.to([textOverlayRef.current, scrollIndicatorRef.current], {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          opacity: 0,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 0.5,
          pin: true,
        }
      });

      tl.addLabel("start", 0);

      // Animate video scrub
      tl.fromTo(video, 
        { currentTime: 0 }, 
        { currentTime: video.duration || 1, ease: "none", duration: 1 },
        "start"
      );

      // Fade out the HTML text overlay and scroll indicator early in the scroll
      if (textOverlayRef.current) {
        tl.to(textOverlayRef.current, {
          opacity: 0,
          duration: 0.15, // Fades out in the first 15% of the scroll
          ease: "power2.inOut"
        }, "start");
      }
      
      if (scrollIndicatorRef.current) {
        tl.to(scrollIndicatorRef.current, {
          opacity: 0,
          duration: 0.1, 
          ease: "power2.inOut"
        }, "start");
      }
    };

    // Use loadeddata instead of loadedmetadata to ensure the first frame is ready
    if (video.readyState >= 2) {
      setupScrollTrigger();
    } else {
      video.addEventListener("loadeddata", setupScrollTrigger);
    }

    return () => {
      video.removeEventListener("loadeddata", setupScrollTrigger);
      document.body.style.overflow = "";
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-charcoal flex flex-col justify-center items-center overflow-hidden">
      
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-charcoal text-sand">
          <div className="font-display text-xl uppercase tracking-widest mb-4">Loading Experience</div>
          <div className="w-48 h-[1px] bg-umber overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-clay w-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Video Element */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          ref={videoRef} 
          src="/gemini_generated_video_17b7cb55.mp4"
          className="w-full h-full object-cover"
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
        />
      </div>
      
      {/* Real accessible text in DOM */}
      <div ref={textOverlayRef} className="relative z-10 flex flex-col items-center justify-center h-full pt-20 pointer-events-none mix-blend-difference text-dust">
        <h1 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-widest mb-6 text-center">
          Awaraa's Culture
        </h1>
        <p className="font-sans text-xl md:text-2xl tracking-wide text-center max-w-3xl px-4 text-sand mix-blend-normal">
          MOVEMENT WITH PURPOSE, NOT AIMLESS WANDERING.
        </p>
      </div>
      
      <div ref={scrollIndicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-sand opacity-70">
        <span className="text-xs uppercase tracking-widest mb-4 font-sans">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-sand to-transparent"></div>
      </div>
    </section>
  );
}
