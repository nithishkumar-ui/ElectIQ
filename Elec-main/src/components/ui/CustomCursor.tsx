import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const cursorY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const outerSpringConfig = { damping: 20, stiffness: 200, mass: 0.8 };
  const outerCursorXSpring = useSpring(cursorX, outerSpringConfig);
  const outerCursorYSpring = useSpring(cursorY, outerSpringConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const interactiveElements = document.querySelectorAll(
      "a, button, input, select, textarea, [role=\"button\"]"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementHover);
      el.addEventListener("mouseleave", handleElementLeave);
    });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover);
        el.removeEventListener("mouseleave", handleElementLeave);
      });
    };
  }, [cursorX, cursorY, isVisible]);

  // Use a MutationObserver to attach events to dynamically added interactive elements
  useEffect(() => {
    const handleElementHover = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    const attachListeners = (node: Element) => {
      if (node.matches && node.matches("a, button, input, select, textarea, [role=\"button\"], .cursor-pointer")) {
        node.addEventListener("mouseenter", handleElementHover);
        node.addEventListener("mouseleave", handleElementLeave);
      }
      
      node.querySelectorAll?.("a, button, input, select, textarea, [role=\"button\"], .cursor-pointer").forEach(el => {
        el.addEventListener("mouseenter", handleElementHover);
        el.addEventListener("mouseleave", handleElementLeave);
      });
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            attachListeners(node as Element);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (!isVisible && typeof window !== "undefined") return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#4E88FF] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#4E88FF] pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: outerCursorXSpring,
          y: outerCursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(78, 136, 255, 0.2)" : "rgba(78, 136, 255, 0)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </>
  );
}
