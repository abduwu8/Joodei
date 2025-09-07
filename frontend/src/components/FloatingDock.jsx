import React from "react";
import { cn } from "../lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const FloatingDock = ({
  navigationItems,
  activeItem
}) => {
  const [hidden, setHidden] = useState(false);

  // Hide dock on scroll down, show on scroll up
  // Lightweight listener without layout thrash
  const lastScrollYRef = useRef(0);
  React.useEffect(() => {
    lastScrollYRef.current = window.scrollY || 0;
    let ticking = false;
    const onScroll = () => {
      const run = () => {
        const curr = window.scrollY || 0;
        const delta = curr - lastScrollYRef.current;
        if (Math.abs(delta) > 4) {
          setHidden(delta > 0 && curr > 24);
          lastScrollYRef.current = curr;
        }
        ticking = false;
      };
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <FloatingDockDesktop items={navigationItems} activeItem={activeItem} hidden={hidden} />
      <FloatingDockMobile items={navigationItems} activeItem={activeItem} hidden={hidden} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  activeItem,
  hidden
}) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={false}
      animate={{ y: hidden ? 120 : 0, opacity: hidden ? 0.9 : 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="fixed bottom-8 right-8 block md:hidden z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}>
                <button
                  onClick={item.onClick}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                    activeItem === item.href
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                  )}>
                  <div className={cn(
                    "h-4 w-4",
                    activeItem === item.href
                      ? "filter brightness-0 invert"
                      : "dark:filter dark:brightness-0 dark:invert dark:opacity-80 dark:hover:opacity-100"
                  )}>{item.icon}</div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
                        <button
                    onClick={() => setOpen(!open)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white transition-all duration-200">
                    <IconLayoutNavbarCollapse className="h-5 w-5" />
                  </button>
    </motion.div>
  );
};

const FloatingDockDesktop = ({
  items,
  activeItem,
  hidden
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex z-50">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={false}
        animate={{ y: hidden ? 120 : 0, opacity: hidden ? 0.9 : 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="h-16 items-end gap-4 rounded-2xl bg-white px-4 pb-3 flex shadow-lg border border-gray-200 dark:bg-gray-900/95 dark:border-gray-700/50 backdrop-blur-sm">
        {items.map((item) => (
          <IconContainer
            mouseX={mouseX}
            key={item.title}
            {...item}
            isActive={activeItem === item.href}
          />
        ))}
      </motion.div>
    </div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  onClick,
  isActive
}) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <button onClick={onClick}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full transition-all duration-200",
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-white"
        )}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md bg-white px-2 py-0.5 text-xs whitespace-pre shadow-lg border border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center">
          <div className={cn(
            isActive ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert dark:opacity-80 dark:hover:opacity-100"
          )}>{icon}</div>
        </motion.div>
      </motion.div>
    </button>
  );
}

export default FloatingDock;
