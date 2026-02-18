<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";

const svgRef = ref<SVGSVGElement | null>(null);
const turbulenceRef = ref<SVGFETurbulenceElement | null>(null);
const displacementRef = ref<SVGFEDisplacementMapElement | null>(null);
const glowRef = ref<SVGCircleElement | null>(null);

let teardown: (() => void) | null = null;
let frameId: number | null = null;
let bounds: DOMRect | null = null;
let lastEvent: PointerEvent | null = null;

const baseFrequency = { x: 0.012, y: 0.018 };
const baseScale = 18;

const mapToViewBox = (x: number, y: number, rect: DOMRect) => {
    const vx = 10 + (x / rect.width) * 80;
    const vy = 10 + (y / rect.height) * 80;
    return { vx, vy };
};

const updateWarp = () => {
    if (!lastEvent || !bounds || !turbulenceRef.value || !displacementRef.value || !glowRef.value) return;

    const x = lastEvent.clientX - bounds.left;
    const y = lastEvent.clientY - bounds.top;
    const dx = x - bounds.width / 2;
    const dy = y - bounds.height / 2;
    const distance = Math.min(Math.hypot(dx, dy), Math.min(bounds.width, bounds.height) / 2);
    const intensity = distance / Math.min(bounds.width, bounds.height);

    const freqX = baseFrequency.x + intensity * 0.04;
    const freqY = baseFrequency.y + intensity * 0.06;
    const scale = baseScale + intensity * 65;

    gsap.to(turbulenceRef.value, {
        attr: { baseFrequency: `${freqX.toFixed(4)} ${freqY.toFixed(4)}` },
        duration: 0.35,
        ease: "power2.out"
    });
    gsap.to(displacementRef.value, { attr: { scale }, duration: 0.35, ease: "power2.out" });

    const { vx, vy } = mapToViewBox(x, y, bounds);
    gsap.to(glowRef.value, { attr: { cx: vx, cy: vy }, duration: 0.25, ease: "power2.out" });

    frameId = null;
};

const scheduleUpdate = (event: PointerEvent) => {
    lastEvent = event;
    if (frameId) return;
    frameId = requestAnimationFrame(updateWarp);
};

const resetWarp = () => {
    if (!turbulenceRef.value || !displacementRef.value || !glowRef.value) return;
    gsap.to(turbulenceRef.value, {
        attr: { baseFrequency: `${baseFrequency.x} ${baseFrequency.y}` },
        duration: 0.6,
        ease: "power3.out"
    });
    gsap.to(displacementRef.value, { attr: { scale: baseScale }, duration: 0.6, ease: "power3.out" });
    gsap.to(glowRef.value, { attr: { r: 18 }, opacity: 0, duration: 0.5, ease: "power2.out" });
};

onMounted(() => {
    const svg = svgRef.value;
    if (!svg) return;

    const handleEnter = () => {
        bounds = svg.getBoundingClientRect();
        if (glowRef.value) {
            gsap.to(glowRef.value, { attr: { r: 32 }, opacity: 0.75, duration: 0.35, ease: "power2.out" });
        }
    };

    const handleMove = (event: PointerEvent) => {
        if (!bounds) bounds = svg.getBoundingClientRect();
        scheduleUpdate(event);
    };

    const handleLeave = () => {
        resetWarp();
    };

    const handleResize = () => {
        bounds = svg.getBoundingClientRect();
    };

    svg.addEventListener("pointerenter", handleEnter);
    svg.addEventListener("pointermove", handleMove, { passive: true });
    svg.addEventListener("pointerleave", handleLeave);
    window.addEventListener("resize", handleResize);

    teardown = () => {
        svg.removeEventListener("pointerenter", handleEnter);
        svg.removeEventListener("pointermove", handleMove);
        svg.removeEventListener("pointerleave", handleLeave);
        window.removeEventListener("resize", handleResize);
        if (frameId) cancelAnimationFrame(frameId);
    };
});

onUnmounted(() => {
    teardown?.();
});
</script>

<template>
    <div class="blob-stage">
        <svg ref="svgRef" preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80">
            <defs>
                <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence
                        ref="turbulenceRef"
                        type="fractalNoise"
                        baseFrequency="0.012 0.018"
                        numOctaves="1"
                        seed="2"
                    />
                    <feDisplacementMap ref="displacementRef" in="SourceGraphic" scale="18" />
                </filter>
                <radialGradient id="blobGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
                    <stop offset="70%" stop-color="#ffffff" stop-opacity="0.15" />
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                </radialGradient>
                <filter id="glowBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" />
                </filter>
            </defs>

            <circle
                ref="glowRef"
                class="blob-glow"
                cx="50"
                cy="50"
                r="18"
                fill="url(#blobGlow)"
                filter="url(#glowBlur)"
            />

            <g filter="url(#liquid)">
                <path
                    fill="#9b5de5"
                    class="out-top"
                    d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
                />
                <path
                    fill="#f15bb5"
                    class="in-top"
                    d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
                />
                <path
                    fill="#00bbf9"
                    class="out-bottom"
                    d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
                />
                <path
                    fill="#00f5d4"
                    class="in-bottom"
                    d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
                />
            </g>
        </svg>
    </div>
</template>

<style scoped>
.blob-stage {
    position: fixed;
    inset: 0;
}

svg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transform-origin: 50% 50%;
    transform-box: fill-box;
    will-change: transform;
}

.blob-glow {
    opacity: 0;
    pointer-events: none;
    mix-blend-mode: screen;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.out-top {
    animation: rotate 20s linear infinite;
    transform-origin: 13px 25px;
}

.in-top {
    animation: rotate 10s linear infinite;
    transform-origin: 13px 25px;
}

.out-bottom {
    animation: rotate 25s linear infinite;
    transform-origin: 84px 93px;
}

.in-bottom {
    animation: rotate 15s linear infinite;
    transform-origin: 84px 93px;
}
</style>