import { useState, useEffect, useRef } from 'react';
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1, 
};

export const useInViewAnimation = (once = true) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) {
          setHasAnimated(true);
          observer.unobserve(entry.target); 
        }
      } else if (!once && !entry.isIntersecting) {
        setInView(false);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, once]);
  return { ref, animate: inView || hasAnimated };
};