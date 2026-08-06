"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOTAL_FRAMES = 240;
const PRIORITY_BATCH_SIZE = 12;

export function Hero() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Real Loading State
    document.body.style.overflow = "hidden";

    // Set tier based on viewport to save bandwidth
    const tier = isMobile ? 'mobile' : 'desktop';
    
    const framesMap = new Map<number, ImageBitmap | HTMLImageElement>();
    let lastDrawnIndex = -1;

    let canvasW = 0, canvasH = 0;
    
    // Setup canvas dimensions once
    const updateCanvasSize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        canvasW = rect.width;
        canvasH = rect.height;
        canvas.width = canvasW;
        canvas.height = canvasH;
        
        if (lastDrawnIndex >= 0 && framesMap.has(lastDrawnIndex)) {
            // Force redraw on resize
            const img = framesMap.get(lastDrawnIndex);
            if(img) drawFrame(img, canvasW, canvasH);
        }
      }
    };
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    const drawFrame = (img: ImageBitmap | HTMLImageElement, w: number, h: number) => {
       // Using object-cover logic
       const imgRatio = img.width / img.height;
       const canvasRatio = w / h;
       let drawW, drawH, drawX, drawY;
       
       if (canvasRatio > imgRatio) {
           drawW = w;
           drawH = w / imgRatio;
           drawX = 0;
           drawY = (h - drawH) / 2;
       } else {
           drawH = h;
           drawW = h * imgRatio;
           drawX = (w - drawW) / 2;
           drawY = 0;
       }
       
       // No clearRect needed for full bleed
       ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    const loadFrame = async (index: number): Promise<ImageBitmap | HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const frameNum = index.toString().padStart(4, '0');
            const url = `/hero-sequence/${tier}/frame_${frameNum}.webp`;
            
            const img = new Image();
            img.src = url;
            
            img.onload = async () => {
                if (window.createImageBitmap) {
                    try {
                        const bitmap = await window.createImageBitmap(img);
                        resolve(bitmap);
                        return;
                    } catch (e) {
                        resolve(img); // Fallback
                    }
                } else {
                    resolve(img);
                }
            };
            img.onerror = reject;
        });
    };

    const initSequence = async () => {
        try {
            // Load Priority Batch
            const priorityPromises: Promise<void>[] = [];
            let loadedCount = 0;
            
            const updateProgressUI = () => {
                loadedCount++;
                const progress = Math.round((loadedCount / PRIORITY_BATCH_SIZE) * 100);
                if (progressBarRef.current) {
                    progressBarRef.current.style.width = `${progress}%`;
                }
                if (progressTextRef.current) {
                    progressTextRef.current.innerText = `${progress}%`;
                }
            };

            for (let i = 1; i <= Math.min(PRIORITY_BATCH_SIZE, TOTAL_FRAMES); i++) {
                priorityPromises.push(
                    loadFrame(i).then(bitmap => {
                        framesMap.set(i, bitmap);
                        updateProgressUI();
                    }).catch(() => {
                        // Ignore individual frame failures
                        updateProgressUI();
                    })
                );
            }
            
            await Promise.all(priorityPromises);
            
            // Priority batch resolved! Unlock scroll.
            document.body.style.overflow = "";
            if (loadingOverlayRef.current) {
                loadingOverlayRef.current.style.opacity = "0";
                loadingOverlayRef.current.style.pointerEvents = "none";
            }

            // Draw first frame immediately
            if (framesMap.has(1)) {
                drawFrame(framesMap.get(1)!, canvasW, canvasH);
                lastDrawnIndex = 1;
            }

            // Start background loading of remaining frames
            if (TOTAL_FRAMES > PRIORITY_BATCH_SIZE) {
                // Background load sequentially so earlier frames arrive first
                (async () => {
                   for (let i = PRIORITY_BATCH_SIZE + 1; i <= TOTAL_FRAMES; i++) {
                       try {
                           const bitmap = await loadFrame(i);
                           framesMap.set(i, bitmap);
                       } catch(e) { /* ignore */ }
                   }
                })();
            }

            // Fallback for Reduced Motion
            if (prefersReducedMotion) {
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

            // Setup ScrollTrigger for Canvas Sequence
            const frameObj = { index: 1 };
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pinWrapperRef.current,
                    start: "top top",
                    end: "+=3000",
                    scrub: 1.2,
                }
            });

            tl.addLabel("start", 0);

            // Frame scrub animation
            let requestRef: number;
            tl.to(frameObj, {
                index: TOTAL_FRAMES,
                ease: "none",
                duration: 1,
                onUpdate: () => {
                    const nextIndex = Math.round(frameObj.index);
                    if (nextIndex !== lastDrawnIndex && framesMap.has(nextIndex)) {
                        lastDrawnIndex = nextIndex;
                        
                        // Decouple draw from scroll tick
                        cancelAnimationFrame(requestRef);
                        requestRef = requestAnimationFrame(() => {
                            const bitmap = framesMap.get(nextIndex);
                            if (bitmap) {
                                drawFrame(bitmap, canvasW, canvasH);
                            }
                        });
                    }
                }
            }, "start");

            // Fade out text early
            if (textOverlayRef.current) {
                tl.to(textOverlayRef.current, {
                    opacity: 0,
                    duration: 0.15,
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

        } catch (e) {
            console.error("Sequence init failed", e);
            document.body.style.overflow = "";
            if (loadingOverlayRef.current) {
                loadingOverlayRef.current.style.opacity = "0";
                loadingOverlayRef.current.style.pointerEvents = "none";
            }
        }
    };

    initSequence();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", updateCanvasSize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full relative z-0" style={{ height: 'calc(3000px + 130vh)' }}>
      <div ref={pinWrapperRef} className="absolute top-0 left-0 w-full" style={{ height: 'calc(3000px + 230vh)' }}>
        <section ref={containerRef} className="sticky top-0 w-full h-screen bg-charcoal flex flex-col justify-center items-center overflow-hidden z-0">
          
          {/* Real Loading State (No React conditional rendering to prevent unmount clashes with GSAP) */}
          <div 
            ref={loadingOverlayRef}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-charcoal text-sand transition-opacity duration-700 opacity-100"
          >
            <div className="font-display text-xl uppercase tracking-widest mb-4">Loading Experience</div>
            <div className="w-48 h-[1px] bg-umber relative">
              <div 
                  ref={progressBarRef}
                  className="absolute top-0 left-0 h-full bg-clay transition-all duration-300 shadow-[0_0_15px_rgba(142,74,47,0.8)]" 
                  style={{ width: "0%" }}
              />
            </div>
            <div ref={progressTextRef} className="mt-4 text-xs font-sans tracking-widest opacity-50">
              0%
            </div>
          </div>

          {/* Canvas Element - aria-hidden for decorative sequence */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full"
              aria-hidden="true"
            />
          </div>
          
          {/* Real accessible text in DOM */}
          <div ref={textOverlayRef} className="relative z-10 flex flex-col items-center justify-center h-full pt-20 pointer-events-none mix-blend-difference text-dust">
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-bold uppercase tracking-widest mb-6 text-center leading-none">
              Awaraa&apos;s Culture
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
      </div>
    </div>
  );
}
