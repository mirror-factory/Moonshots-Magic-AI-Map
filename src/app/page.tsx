/**
 * @module app/page
 * Home page - narrative-driven introduction to Moonshots & Magic.
 * Tells the story of Central Florida's transformation from moonshots to magic,
 * showcases the region's talent and future, and introduces the interactive map.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Stars } from "@/components/effects/stars";
import { Sparkles } from "@/components/effects/sparkles";
import { PoweredByBadge } from "@/components/powered-by-badge";
import { Rocket, MapPin, ArrowRight } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Animated logo component. */
function AnimatedLogo({ className, width = 750, height = 250 }: { className?: string; width?: number; height?: number }) {
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;

    const paths = logoRef.current.querySelectorAll("path");

    gsap.set(paths, { opacity: 0.15 });

    gsap.to(paths, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
      delay: 0.3,
    });
  }, []);

  return (
    <svg
      ref={logoRef}
      width={width}
      height={height}
      viewBox="0 0 273 117"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15.3636 19.5225C19.8139 19.5414 24.2644 19.5327 28.7148 19.4965C29.4712 23.4915 30.1431 27.5018 30.7302 31.5249C31.1722 34.436 31.6129 38.1833 32.4245 40.9829C33.01 36.1149 33.8673 31.2058 34.6782 26.3647C35.0629 24.0679 35.2772 21.8401 35.7428 19.5353C39.9817 19.4304 44.6139 19.525 48.884 19.5258L48.8814 60.5078L39.1126 60.4944L39.1007 42.1983C39.1074 40.9724 39.2305 37.3699 38.8593 36.4414L38.7043 36.4636C38.2124 37.461 37.7598 41.6744 37.5605 43.0233L36.319 51.0876C35.7979 54.5143 35.1603 56.9338 34.8576 60.5117C33.072 60.5197 31.2865 60.5081 29.5012 60.477C28.252 53.0469 27.1176 45.598 26.0985 38.1331C26.002 37.4647 25.9406 36.6278 25.4035 36.2287L25.2453 36.3432C25.0204 37.0964 25.1518 43.6316 25.1565 44.848L25.1488 60.4923L15.3686 60.5012C15.1807 47.0008 15.3633 33.0596 15.3636 19.5225Z" fill="white"/>
      <path d="M120.961 64.0655C125.098 64.2421 129.864 63.9998 134.139 64.1073L134.141 90.8396C134.141 95.1215 133.979 100.766 134.189 104.969C131.035 105.049 127.532 104.998 124.363 104.967L124.353 86.1156C124.355 85.1699 124.492 81.0423 124.095 80.5128L123.947 80.5698C123.503 81.6464 122.82 87.0905 122.573 88.5639C122.053 91.6596 121.551 94.8628 121.127 97.977C120.813 100.291 120.138 102.658 119.906 105.006C118.198 104.974 116.433 104.991 114.719 104.986C114.45 102.577 113.859 99.5332 113.398 97.0892C112.389 91.7366 112.133 84.9523 110.566 79.8532C110.259 81.3073 110.367 86.7689 110.369 88.6093L110.369 104.991C107.121 105 103.874 104.99 100.626 104.962L100.631 74.1604L100.632 66.8194C100.632 66.2176 100.536 64.4913 100.778 64.1161L101.405 64.0744L113.97 64.0654C115.03 69.5589 115.683 75.2741 116.678 80.7958C116.968 82.4053 117.12 83.9592 117.468 85.5839C118.565 78.4006 119.73 71.2275 120.961 64.0655Z" fill="white"/>
      <path d="M103.479 19.5237L116.458 19.5098C116.87 21.2653 117.097 23.168 117.424 24.958L119.658 36.8761C120.232 40.0142 120.682 43.0569 121.486 46.1649C121.825 45.016 121.713 38.6316 121.713 36.9673L121.719 19.5221L131.562 19.524L131.562 59.2636L131.551 60.4875C127.456 60.5568 122.603 60.5785 118.533 60.4548C118.282 59.0828 117.906 57.6876 117.626 56.3059C116.327 49.8993 115.267 43.4253 113.852 37.0471C113.783 36.738 113.646 36.5502 113.376 36.4183C113.036 37.0142 113.176 58.0763 113.176 60.5187C110.045 60.4575 106.611 60.4803 103.479 60.5044C103.4 55.8237 103.47 50.9113 103.469 46.2099L103.479 19.5237Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M196.243 19.1661C202.567 18.4702 209.271 21.6321 210.229 28.6544C210.649 31.7255 210.346 35.7701 210.351 38.9639L210.366 46.2686C210.374 51.2254 210.41 55.1924 206.013 58.5645C203.954 60.1434 201.845 60.7793 199.278 61.087C195.464 61.2557 192.321 60.6614 189.197 58.2706C183.436 53.8604 185.184 46.5132 184.892 40.2559C184.843 39.2202 184.873 38.0421 184.889 37.0098C185.007 34.2378 184.625 31.2532 185.199 28.5254C186.427 22.6993 190.642 19.7833 196.243 19.1661ZM198.726 26.5626C198.129 26.3717 197.56 26.3561 196.945 26.4522C196.425 26.6789 195.883 26.8966 195.403 27.1944C194.749 28.4908 194.749 29.403 194.749 30.8419C194.747 37.294 194.705 43.7507 194.773 50.2022C194.78 50.9191 194.956 51.7544 195.159 52.4405C195.593 53.895 197.58 53.7485 198.802 53.6661C199.595 53.306 200.2 52.8441 200.517 52.0079C200.93 50.9207 200.826 32.4526 200.717 29.8917C200.691 29.3003 200.693 28.4862 200.437 27.9483C200.116 27.2722 199.425 26.7857 198.726 26.5626Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M88.0515 19.1625C91.549 18.8846 94.9829 19.3195 97.8239 21.4936C100.123 23.2918 101.917 26.2245 102.092 29.1811C102.466 35.4756 102.156 41.9176 102.259 48.2211C102.381 55.5963 98.4102 60.201 91.0612 61.0883C84.0186 61.4381 77.708 58.0953 76.9362 50.5199C76.6304 47.2373 76.8704 43.8952 76.7868 40.6029C76.7462 39.0038 76.8762 37.2243 76.7849 35.6606C76.2882 27.1554 78.1929 20.2832 88.0515 19.1625ZM91.9577 27.2875C90.7858 26.5619 90.2598 26.2587 88.821 26.4467C88.0786 26.7393 87.1498 27.0305 86.8181 27.8305C86.3982 28.8453 86.3846 51.2742 86.7956 52.2055C87.0677 52.817 87.6615 53.2909 88.2292 53.6205C88.9256 53.6665 89.6197 53.7264 90.3171 53.7006C91.7868 53.3617 92.2904 52.7718 92.3493 51.2025C92.503 47.1141 92.3783 43.005 92.4167 38.9125C92.4074 36.942 92.5432 29.4089 92.2272 28.0883C92.159 27.8146 92.0686 27.5469 91.9577 27.2875Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M61.4043 19.1639C68.2784 18.5917 74.5326 21.6541 75.3974 29.1482C75.761 32.3002 75.5756 35.7566 75.5752 38.9627C75.5746 43.2779 75.8055 47.7888 75.2119 52.0594C74.2345 57.5778 69.6181 60.4574 64.4345 61.0867C60.6044 61.2526 57.5341 60.6496 54.4218 58.3123C48.7494 54.1303 50.3554 46.7745 50.125 40.7039C50.0704 39.2654 50.2007 37.678 50.1162 36.2625C49.5982 27.5886 51.17 20.3272 61.4043 19.1639ZM65.331 27.325C64.1269 26.5666 63.6297 26.2732 62.1455 26.4383C61.4621 26.7136 61.2005 26.821 60.5664 27.2273C59.9899 28.5085 59.9656 29.4063 59.9668 30.8025C59.9726 37.3237 59.9147 43.8509 60.0009 50.3709C60.0097 51.0318 60.1864 51.846 60.3642 52.4813C60.851 53.855 62.6408 53.7321 63.7949 53.6873C64.3914 53.5066 65.0365 53.307 65.3281 52.7068C65.5064 52.3398 65.5686 51.92 65.6142 51.5184C65.761 50.2265 65.7333 48.9207 65.7343 47.6229C65.7393 41.9811 65.7385 36.3389 65.7265 30.6971C65.724 29.5677 65.7159 28.4019 65.331 27.325Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M69.7338 64.2037C74.9882 63.5013 80.4314 66.1083 82.518 71.0856C83.4568 73.3254 83.575 75.4566 83.5707 77.8365L74.8236 77.8405C74.819 76.7657 74.8636 75.6496 74.6889 74.5905C74.3624 72.6111 71.8615 71.8768 70.3207 72.9947C69.8504 73.3382 69.5418 73.8591 69.4672 74.4352C69.2502 76.0268 70.8604 77.8615 71.7846 79.069C73.4528 81.2487 75.1616 83.4028 76.8373 85.5778L91.8832 104.93C89.9575 105.026 87.7282 104.98 85.7797 104.985C84.1858 104.99 82.5911 104.981 80.9974 104.957C79.7957 103.22 77.9187 100.991 76.559 99.316C73.0287 106.643 61.4988 106.291 55.89 101.585C50.9256 97.4188 50.1156 89.3795 54.4154 84.4479C56.7816 81.734 59.247 80.8337 62.8021 80.5475C61.7619 79.0006 61.2514 77.9954 60.8685 76.108C60.3737 73.5707 60.9083 70.9412 62.3549 68.7955C64.0901 66.214 66.7289 64.7881 69.7338 64.2037ZM67.9945 88.0074C66.8679 87.3797 65.5679 87.2725 64.3051 87.4108C57.9598 88.7565 59.3016 97.0115 66.6098 96.2799C69.2548 95.6444 71.0323 93.8221 70.2807 90.9469C69.9451 89.7015 69.1212 88.6424 67.9945 88.0074Z" fill="#0063CD"/>
      <path d="M159.913 19.5213L169.672 19.5167L169.685 36.658C171.121 36.6712 172.558 36.6653 173.995 36.6408C173.961 30.9364 173.961 25.232 173.995 19.5278L183.674 19.527C183.875 32.9351 183.699 46.9563 183.678 60.3886C183.266 60.6436 175.133 60.4756 173.973 60.4503L173.972 43.8053C172.58 43.8288 171.107 43.8003 169.708 43.7961C169.492 48.8791 169.669 55.337 169.669 60.5206L159.914 60.4992C159.682 47.0851 159.899 32.9593 159.913 19.5213Z" fill="white"/>
      <path d="M173.521 63.528C177.322 63.0558 181.237 64.3568 183.967 67.0344C187.779 70.7739 187.305 75.6398 187.289 80.5324L177.519 80.5258C177.359 78.2159 177.71 75.3827 177.42 73.1715C176.977 69.7871 171.76 69.9262 171.774 74.0379C171.796 81.3465 171.558 88.7093 171.878 96.008C171.899 96.4858 172.222 96.9816 172.538 97.3222C173.065 97.8849 173.797 98.2153 174.57 98.2406C178.601 98.3885 177.176 92.9871 177.432 90.458C177.472 90.0628 177.427 89.4453 177.426 89.036C176.102 88.9681 174.786 88.8017 173.489 88.5378C173.977 86.1072 174.176 83.8084 174.397 81.3454L176.457 81.6146C180.126 82.2562 183.642 82.4627 187.287 83.0478L187.299 89.4805C187.303 93.4806 187.547 97.2861 185.065 100.689C183.222 103.173 180.466 104.831 177.4 105.302C170.95 106.292 163.355 103.236 162.312 96.0159C161.796 92.4379 162.116 88.2338 162.063 84.5783C162.007 80.7182 161.94 76.6354 162.369 72.8096C163.3 66.9589 168.196 64.2783 173.521 63.528Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M155.808 64.0771C155.852 66.0352 156.378 68.1132 156.642 70.0547C156.976 72.5135 157.357 74.9268 157.735 77.374L161.926 104.993C158.547 104.966 155.105 105.048 151.733 104.941C151.639 103.383 151.474 101.919 151.301 100.368C151.081 99.0988 150.869 97.8275 150.671 96.5547L146.405 96.5605C145.971 98.5809 145.575 102.839 145.345 104.997L135.405 104.963C136.004 100.529 136.657 96.1025 137.362 91.6846C137.712 89.5732 138.157 87.4294 138.472 85.3213L140.74 70.5312C141.048 68.5181 141.261 66.3011 141.632 64.3242C141.929 64.0026 141.995 64.1102 142.587 64.0762L155.808 64.0771ZM148.144 74.1465C147.488 79.284 147.411 84.4088 146.726 89.6797L148.812 89.708L150.395 89.71C150.313 86.4905 149.778 83.0338 149.457 79.8027C149.345 78.6676 149.218 75.2616 148.993 74.4053C148.644 74.1418 148.638 74.2154 148.144 74.1465Z" fill="white"/>
      <path d="M143.684 19.1685C144.273 19.1054 144.866 19.0767 145.458 19.0827C151.318 19.0864 156.177 22.0636 157.663 27.9074C158.162 29.8689 158.102 31.7097 158.095 33.71L148.259 33.6968C148.241 31.3253 148.637 29.33 147.557 27.2359C146.771 26.7172 145.959 26.3236 144.987 26.3979C144.318 26.448 143.7 26.7754 143.283 27.3005C142.283 28.5332 142.452 31.2222 142.591 32.7315C142.981 36.7297 147.575 36.0906 150.39 36.6152C154.833 37.4428 158.092 40.1802 158.513 44.8216C158.723 46.3486 158.603 47.8812 158.623 49.4079C158.712 55.9876 154.023 60.3356 147.52 61.0497C146.943 61.1038 146.362 61.129 145.782 61.1254C142.311 61.1094 139.134 60.0528 136.663 57.5577C133.568 54.4333 133.344 50.7547 133.361 46.6316L143.221 46.6343C143.287 48.4497 142.773 51.7406 144.197 53.0605C144.769 53.5806 145.529 53.8443 146.302 53.7901C149.526 53.5739 149.12 49.5605 148.928 47.3205C148.603 43.4979 144.39 44.1525 141.576 43.4896C136.728 42.3144 133.51 39.639 132.929 34.5833C132 26.5003 134.783 20.1568 143.684 19.1685Z" fill="white"/>
      <path d="M245.721 19.1663C246.28 19.1069 246.841 19.0784 247.402 19.0808C253.266 19.0607 258.241 21.9528 259.739 27.8959C260.239 29.8742 260.193 31.683 260.191 33.7024L250.327 33.6946C250.304 32.1591 250.384 30.7191 250.311 29.113C250.339 26.5272 246.723 25.4725 245.24 27.3765C244.316 28.5624 244.634 32.5391 244.852 33.9692C247.658 37.8377 253.093 35.2827 256.852 38.3132C258.7 39.6299 260.127 41.5706 260.467 43.8846C261.71 52.3264 259.805 59.2262 250.334 60.9531C244.779 61.8284 238.906 59.6936 236.564 54.3124C235.439 51.7267 235.451 49.3791 235.489 46.6274L245.3 46.6343C245.347 49.0334 244.532 54.1202 248.471 53.7904C249.207 53.7331 249.886 53.374 250.346 52.7988C251.369 51.5208 251.211 48.7094 251.012 47.1214C250.556 43.5287 246.348 44.1267 243.657 43.4865C239.12 42.5141 235.629 39.6176 235.055 34.9194C234.051 26.6958 236.642 20.2573 245.721 19.1663Z" fill="white"/>
      <path d="M210.967 63.5277C211.537 63.4596 212.11 63.4312 212.682 63.4429C215.946 63.5324 219.329 64.7686 221.569 67.1829C225.209 71.1062 224.789 75.5917 224.645 80.5436C221.479 80.48 218.183 80.5227 215.009 80.5218C214.938 78.5328 215.229 74.9081 214.912 73.1901C214.279 69.7601 209.217 69.747 209.262 74.449C209.33 81.544 209.101 88.6235 209.329 95.7119C209.37 96.981 210.519 98.0903 211.735 98.2483C216.147 98.8369 214.933 90.9438 214.925 87.8009L218.147 87.7977L224.689 87.8127C224.704 92.3624 225.268 96.9605 222.395 100.825C218.22 106.442 209.454 106.887 204.034 102.916C201.598 101.138 199.971 98.4656 199.515 95.4902C199.153 93.0642 199.342 87.7435 199.336 85.0567C199.569 81.2688 198.91 76.9764 199.57 73.2504C200.665 67.0778 205.401 64.3433 210.967 63.5277Z" fill="white"/>
      <path d="M211.592 19.5209L233.636 19.522L233.643 28.2003L227.482 28.2083C227.385 31.2249 227.453 34.5656 227.453 37.6012V54.5159L227.45 60.5204C224.289 60.4593 220.91 60.4949 217.746 60.5005C217.636 57.0076 217.73 53.0263 217.73 49.503L217.722 28.2146L211.59 28.1911L211.592 19.5209Z" fill="white"/>
      <path d="M189.286 64.0731C192.232 64.0572 195.178 64.0639 198.124 64.0933C198.125 67.2166 198.161 70.4372 198.063 73.5492C195.686 73.3583 192.293 71.9618 189.535 71.3336C192.073 73.0306 194.801 73.5866 197.016 75.3872C197.397 75.6961 197.887 76.4111 197.953 76.9273C198.218 78.9786 198.125 81.4017 198.125 83.4915L198.113 95.9506L198.115 104.989C194.911 105.003 191.709 104.994 188.506 104.961L188.512 77.9184C188.512 73.5457 188.376 68.5898 188.513 64.2744C188.777 64.0115 188.797 64.0982 189.286 64.0731Z" fill="white"/>
    </svg>
  );
}

/** Home page - narrative introduction to Moonshots & Magic. */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const [showStars] = useState(true);
  const [showEffects] = useState(true);
  const [showBackgroundImages] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Scroll-triggered nav bar
  useEffect(() => {
    if (!navRef.current || !heroRef.current) return;

    const handleScroll = () => {
      if (!navRef.current || !heroRef.current) return;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollY = window.scrollY;

      // Show nav after scrolling past hero
      if (scrollY > heroHeight - 100) {
        navRef.current.style.opacity = "1";
        navRef.current.style.visibility = "visible";
        navRef.current.style.pointerEvents = "auto";
      } else {
        navRef.current.style.opacity = "0";
        navRef.current.style.visibility = "hidden";
        navRef.current.style.pointerEvents = "none";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle newsletter form submission
  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");

    // Reset success state after animation
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.from(".hero-title", {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.6,
      });

      gsap.from(".hero-description", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.9,
      });

      gsap.from(".hero-cta", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        delay: 1.2,
      });

      // Ken Burns zoom effects on background images
      gsap.to(".background-zoom-left", {
        scale: 1.2,
        y: 30,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".background-zoom-center", {
        scale: 1.2,
        y: 20,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".background-zoom-right", {
        scale: 1.2,
        y: 30,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Background parallax on scroll
      gsap.to(".background-zoom-left, .background-zoom-right", {
        y: 300,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".background-zoom-center", {
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Sequential highlight animation for each image
      gsap.to(".image-highlight-left", {
        opacity: 0,
        duration: 2.5,
        delay: 1.8,
        ease: "power2.inOut",
      });

      gsap.to(".image-highlight-center", {
        opacity: 0,
        duration: 2.5,
        delay: 2.3,
        ease: "power2.inOut",
      });

      gsap.to(".image-highlight-right", {
        opacity: 0,
        duration: 2.5,
        delay: 2.8,
        ease: "power2.inOut",
      });

      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>(".animate-section").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="w-full max-w-[100vw] overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] flex-col justify-center overflow-hidden px-6 py-16 sm:min-h-[60vh] md:min-h-[95vh] md:py-20">
        {/* Three-column Background */}
        {showBackgroundImages && (
          <div className="background-images absolute inset-0 z-0 flex flex-col md:flex-row">
            {/* Left - Apollo 11 */}
            <div className="relative h-1/3 w-full overflow-hidden md:h-full md:w-1/3">
              <div
                className="background-zoom-left absolute inset-0"
                style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
              >
                <Image
                  src="/images/presentation/apollo-11.jpg"
                  alt="Apollo 11"
                  fill
                  className="object-cover"
                  style={{
                    filter: "grayscale(1) blur(3px) brightness(0.45)",
                    objectPosition: "center 60%",
                  }}
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-black/20" />
              {/* Highlight overlay */}
              <div
                className="image-highlight-left absolute inset-0 bg-white/15"
                style={{ pointerEvents: "none" }}
              />
              <div
                className="absolute inset-y-0 right-0 w-48 md:w-64 lg:w-80"
                style={{
                  background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.4) 100%)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Center - Disney World */}
            <div className="relative h-1/3 w-full overflow-hidden md:h-full md:w-1/3">
              <div
                className="background-zoom-center absolute inset-0"
                style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
              >
                <Image
                  src="/images/presentation/disney-world.jpg"
                  alt="Disney World"
                  fill
                  className="object-cover"
                  style={{
                    filter: "grayscale(1) blur(3px) brightness(0.45)",
                    objectPosition: "center 60%",
                  }}
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-black/20" />
              {/* Highlight overlay */}
              <div
                className="image-highlight-center absolute inset-0 bg-white/15"
                style={{ pointerEvents: "none" }}
              />
              <div
                className="absolute inset-y-0 left-0 w-48 md:w-64 lg:w-80"
                style={{
                  background: "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.4) 100%)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-48 md:w-64 lg:w-80"
                style={{
                  background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.4) 100%)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Right - JFK */}
            <div className="relative h-1/3 w-full overflow-hidden md:h-full md:w-1/3">
              <div
                className="background-zoom-right absolute inset-0"
                style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
              >
                <Image
                  src="/images/presentation/jfk.webp"
                  alt="JFK"
                  fill
                  className="object-cover"
                  style={{
                    filter: "grayscale(1) blur(3px) brightness(0.45)",
                    objectPosition: "center 60%",
                  }}
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-black/20" />
              {/* Highlight overlay */}
              <div
                className="image-highlight-right absolute inset-0 bg-white/15"
                style={{ pointerEvents: "none" }}
              />
              <div
                className="absolute inset-y-0 left-0 w-48 md:w-64 lg:w-80"
                style={{
                  background: "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.4) 100%)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at top left, black 0%, transparent 40%),
                  radial-gradient(ellipse at top right, black 0%, transparent 40%),
                  radial-gradient(ellipse at center top, rgba(0,0,0,0.6) 0%, transparent 50%)
                `,
              }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-transparent" />

            {/* Fade to background at bottom */}
            <div
              className="absolute inset-x-0 bottom-0 h-96"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, rgba(5, 5, 5, 0.3) 40%, rgba(5, 5, 5, 0.7) 70%, var(--background) 100%)",
              }}
            />
          </div>
        )}

        {/* Stars */}
        {showStars && <Stars count={250} shootingStars={2} />}

        {/* Sparkles */}
        {showEffects && <Sparkles count={15} />}

        {/* Grain texture */}
        {showEffects && <div className="grain-texture absolute inset-0 z-10" />}

        <div className="relative z-20 mx-auto max-w-6xl px-4 pt-32 sm:px-6">
          <div className="mb-8 text-center">
            {/* Dark backdrop for text visibility */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "min(900px, 90vw)",
                height: "min(500px, 60vh)",
                background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
              }}
            />

            {/* Blue glow behind logo */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "min(800px, 80vw)",
                height: "min(400px, 50vh)",
                background: "radial-gradient(circle, rgba(0, 99, 205, 0.4) 0%, transparent 70%)",
                filter: "blur(80px)",
                pointerEvents: "none",
              }}
            />

            {/* Subtitle above logo */}
            <p
              className="hero-subtitle relative mb-2 text-lg font-light tracking-wide"
              style={{
                color: "var(--brand-primary)",
                fontFamily: "var(--font-inter, sans-serif)",
                fontWeight: 300,
                textShadow: "0 0 30px rgba(0, 99, 205, 0.8), 0 0 60px rgba(0, 99, 205, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              Where Ambition Meets Wonder
            </p>

            {/* Logo */}
            <div className="hero-title relative mb-4 flex justify-center px-4">
              <div
                style={{
                  filter: "drop-shadow(0 0 60px rgba(0, 99, 205, 0.6)) drop-shadow(0 0 120px rgba(0, 99, 205, 0.4)) drop-shadow(0 0 180px rgba(0, 99, 205, 0.2))",
                }}
                className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[750px]"
              >
                <AnimatedLogo className="h-auto w-full" width={750} height={250} />
              </div>
            </div>
          </div>

          <p
            className="hero-description mx-auto max-w-3xl px-4 text-center text-base leading-relaxed sm:text-lg md:text-xl"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-chakra-petch, sans-serif)",
              opacity: 0.85,
            }}
          >
            Born from a region that sent humans to the Moon and built worlds of magic. A place of
            immense talent, fortitude, and creativity. This is the story of Central Florida.
          </p>

          {/* CTA */}
          <div className="hero-cta mt-12 flex justify-center gap-4">
            <Link
              href="/map"
              className="group flex items-center gap-2 rounded-full px-8 py-4 font-medium transition-all hover:scale-105"
              style={{
                background: "var(--brand-primary)",
                color: "#FFFFFF",
                fontFamily: "var(--font-chakra-petch, sans-serif)",
                boxShadow: "0 0 40px rgba(0, 99, 205, 0.6), 0 0 80px rgba(0, 99, 205, 0.3)",
              }}
            >
              <MapPin className="h-5 w-5" />
              Explore the Map
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Navigation Bar - hidden until scrolled past hero */}
      <nav
        ref={navRef}
        className="fixed left-0 right-0 top-0 z-50"
        style={{
          pointerEvents: "none",
          opacity: 0,
          visibility: "hidden",
        }}
      >
        <div
          className="border-b px-6 py-4"
          style={{
            background: "rgba(5, 5, 5, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-6 w-6" style={{ color: "var(--brand-primary)" }} />
              <span style={{ color: "var(--text)", fontWeight: 600 }}>Moonshots & Magic</span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/brand-guide"
                className="text-sm transition-colors hover:text-brand-primary"
                style={{ color: "var(--text-dim)" }}
              >
                Brand Guide
              </Link>
              <Link
                href="/map"
                className="rounded-full px-5 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: "var(--brand-primary)",
                  color: "#FFFFFF",
                }}
              >
                Explore Map
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <main className="relative mx-auto max-w-6xl px-6 py-20">
        {/* The Story */}
        <section className="animate-section mb-32">
          <h2
            className="mb-6 text-4xl font-black uppercase tracking-tight md:text-5xl"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              color: "var(--text)",
              textShadow: "0 0 30px rgba(0, 99, 205, 0.5)",
            }}
          >
            The Story
          </h2>
          <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--text-dim)" }}>
            <p>
              Central Florida is a region built on impossible ambitions. In the 1960s, Cape Canaveral became the
              launching point for humanity's journey to the Moon. Engineers, scientists, and dreamers converged on
              this stretch of coastline to achieve what had never been done before.
            </p>
            <p>
              At the same time, a different kind of magic was taking root. Walt Disney envisioned a place where wonder
              was engineered with precision—where imagination became reality through technology, storytelling, and
              relentless innovation. What started with a castle in the swampland became a global symbol of possibility.
            </p>
            <p>
              These two forces—moonshots and magic—define who we are. We&apos;re a region that doesn&apos;t just dream big; we
              build big. From the Saturn V rocket to the Spaceship Earth, from the Space Shuttle to Universal's
              immersive worlds, Central Florida has always been where ambition meets wonder.
            </p>
          </div>
        </section>

        {/* Featured Imagery - Moonshots & Magic */}
        <section className="animate-section mb-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Moonshots - Cape Canaveral */}
            <div className="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02]" style={{
              borderColor: "var(--border-color)",
              boxShadow: "none"
            }}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/presentation/mercury-program.jpg"
                  alt="Moonshots - Mercury Program"
                  fill
                  className="object-cover"
                  style={{
                    filter: "grayscale(1) contrast(1.1) brightness(0.9)",
                  }}
                />
              </div>
              <div className="relative bg-surface p-4">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <Sparkles count={8} />
                </div>
                <p className="relative z-10 text-lg font-bold uppercase" style={{ fontFamily: "var(--font-bebas-neue)" }}>
                  Moonshots
                </p>
                <p className="relative z-10 text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
                  Engineering the impossible
                </p>
              </div>
            </div>

            {/* Magic - Disney World */}
            <div className="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02]" style={{
              borderColor: "var(--border-color)",
              boxShadow: "none"
            }}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/presentation/disney-world.jpg"
                  alt="Magic - Disney World"
                  fill
                  className="object-cover"
                  style={{
                    filter: "grayscale(1) contrast(1.1) brightness(0.9)",
                  }}
                />
              </div>
              <div className="relative bg-surface p-4">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <Sparkles count={8} />
                </div>
                <p className="relative z-10 text-lg font-bold uppercase" style={{ fontFamily: "var(--font-bebas-neue)" }}>
                  Magic
                </p>
                <p className="relative z-10 text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
                  Wonder through innovation
                </p>
              </div>
            </div>

            {/* Future - Orlando Today */}
            <div className="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02]" style={{
              borderColor: "var(--border-color)",
              boxShadow: "none"
            }}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/presentation/orlando-today.jpg"
                  alt="Future - Orlando Today"
                  fill
                  className="object-cover"
                  style={{
                    filter: "grayscale(1) contrast(1.1) brightness(0.9)",
                  }}
                />
              </div>
              <div className="relative bg-surface p-4">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <Sparkles count={8} />
                </div>
                <p className="relative z-10 text-lg font-bold uppercase" style={{ fontFamily: "var(--font-bebas-neue)" }}>
                  Future
                </p>
                <p className="relative z-10 text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
                  Building tomorrow, today
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Talent */}
        <section className="animate-section mb-32">
          <h2
            className="mb-6 text-4xl font-black uppercase tracking-tight md:text-5xl"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              color: "var(--text)",
              textShadow: "0 0 30px rgba(0, 99, 205, 0.5)",
            }}
          >
            The Talent
          </h2>
          <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--text-dim)" }}>
            <p>
              Central Florida's talent ecosystem is as diverse as it is deep. We&apos;re home to aerospace engineers who
              design the next generation of spacecraft, theme park Imagineers who create immersive experiences, film
              and television production crews, world-class animators, and cutting-edge software developers.
            </p>
            <p>
              Our universities—UCF, Full Sail, Rollins, and others—graduate thousands of skilled professionals each
              year in fields ranging from simulation and modeling to digital media, hospitality technology, and
              biomedical engineering. The region's partnership between academia, industry, and government has created
              a talent pipeline unlike anywhere else in the world.
            </p>
            <p>
              This convergence of creative and technical talent isn&apos;t accidental. It's the result of decades of
              investment in education, infrastructure, and a culture that celebrates both science and storytelling.
            </p>
          </div>
        </section>

        {/* The Future */}
        <section className="animate-section mb-32">
          <h2
            className="mb-6 text-4xl font-black uppercase tracking-tight md:text-5xl"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              color: "var(--text)",
              textShadow: "0 0 30px rgba(0, 99, 205, 0.5)",
            }}
          >
            The Future
          </h2>
          <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--text-dim)" }}>
            <p>
              Today, Central Florida stands at the forefront of emerging technologies that will define the next
              century. Our region is a hub for robotics, artificial intelligence, simulation and training systems,
              and digital twin technology.
            </p>
            <p>
              Companies like <strong style={{ color: "var(--brand-primary)" }}>SpaceX</strong> are launching rockets
              from the same pads that sent astronauts to the Moon. Defense contractors and startups alike are
              developing autonomous systems, advanced sensors, and AI-powered platforms. The simulation technology
              pioneered here trains everyone from fighter pilots to theme park cast members.
            </p>
            <p>
              We&apos;re not just adopting these technologies—we're inventing them. From digital twins that model entire
              cities to immersive virtual environments that blur the line between physical and digital, Central
              Florida is where the future is being built.
            </p>
          </div>
        </section>

        {/* The Map */}
        <section className="animate-section mb-32">
          <h2
            className="mb-6 text-4xl font-black uppercase tracking-tight md:text-5xl"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              color: "var(--text)",
              textShadow: "0 0 30px rgba(0, 99, 205, 0.5)",
            }}
          >
            The Map
          </h2>
          <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--text-dim)" }}>
            <p>
              Moonshots & Magic is an interactive map that tells the story of Central Florida through its events,
              landmarks, and cultural moments. It's a narrative-driven discovery tool that helps you explore the
              region through the lens of its impossible, improbable transformation.
            </p>
            <p>
              Discover events ranging from space launches and theme park openings to tech conferences, arts festivals,
              and community gatherings. Use AI-powered search to find experiences that match your interests, or let
              the map take you on a cinematic flyover tour of the region's history.
            </p>
            <p>
              Whether you're a resident, a visitor, or just curious about what makes this place special, the map is
              your guide to a region built on ambition and wonder.
            </p>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="animate-section mb-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-black uppercase tracking-tight md:text-5xl" style={{
              fontFamily: "var(--font-bebas-neue)",
              color: "var(--text)",
              textShadow: "0 0 30px rgba(0, 99, 205, 0.6)"
            }}>
              Stay Updated
            </h2>
            <p className="mb-8 text-lg" style={{ color: "var(--text-dim)", fontFamily: "var(--font-chakra-petch, sans-serif)" }}>
              Get the latest updates on events, launches, and the stories that make Central Florida extraordinary.
            </p>

            {!isSuccess ? (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-full px-6 py-4 text-base outline-none transition-all focus:scale-[1.02]"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "var(--text)",
                    fontFamily: "var(--font-chakra-petch, sans-serif)",
                    boxShadow: "inset 0 0 20px rgba(0, 99, 205, 0.1)"
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group rounded-full px-8 py-4 font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    background: isSubmitting ? "rgba(0, 99, 205, 0.5)" : "var(--brand-primary)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-chakra-petch, sans-serif)",
                    boxShadow: isSubmitting
                      ? "0 0 20px rgba(0, 99, 205, 0.3)"
                      : "0 0 40px rgba(0, 99, 205, 0.6), 0 0 80px rgba(0, 99, 205, 0.3)"
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Subscribing...
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            ) : (
              <div className="relative py-8">
                {/* Success message */}
                <div className="animate-in fade-in zoom-in duration-500">
                  <div className="mb-4 text-6xl">✨</div>
                  <h3 className="mb-2 text-2xl font-bold" style={{ color: "var(--brand-primary)", fontFamily: "var(--font-bebas-neue)" }}>
                    Welcome Aboard!
                  </h3>
                  <p className="text-lg" style={{ color: "var(--text-dim)" }}>
                    Thank you for subscribing. Get ready for amazing updates!
                  </p>
                </div>

                {/* Celebration sparkles */}
                <div className="absolute inset-0 animate-in fade-in zoom-in duration-1000">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-2 w-2 animate-pulse rounded-full"
                      style={{
                        background: i % 2 === 0 ? "#0063CD" : "#FFFFFF",
                        boxShadow: i % 2 === 0 ? "0 0 20px #0063CD" : "0 0 20px #FFFFFF",
                        left: `${15 + (i * 7)}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "1.5s"
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-12" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center">
              <AnimatedLogo className="h-auto" width={200} height={67} />
            </div>
            <div className="flex gap-6">
              <Link
                href="/brand-guide"
                className="text-sm transition-colors hover:text-brand-primary"
                style={{ color: "var(--text-dim)" }}
              >
                Brand Guide
              </Link>
              <Link
                href="/map"
                className="text-sm transition-colors hover:text-brand-primary"
                style={{ color: "var(--text-dim)" }}
              >
                Map
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm" style={{ color: "var(--text-dim)" }}>
            Maintained by Mirror Factory • 2026
          </div>
        </div>
      </footer>

      {/* Powered by badge */}
      <PoweredByBadge />
    </div>
  );
}
