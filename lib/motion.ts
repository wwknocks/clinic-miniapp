import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const slideInFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const slideInFromTop: Variants = {
  hidden: {
    opacity: 0,
    y: "-100%",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const cardHover = {
  rest: {
    y: 0,
    boxShadow:
      "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
  },
  hover: {
    y: -4,
    boxShadow:
      "0 16px 48px 0 rgba(0, 0, 0, 0.5), inset 0 1px 2px 0 rgba(255, 255, 255, 0.1)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const progressVariants: Variants = {
  initial: {
    width: 0,
  },
  animate: (value: number) => ({
    width: `${value}%`,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};
