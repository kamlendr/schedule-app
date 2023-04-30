import { useEffect, useRef } from 'react';

const useResizeObserver = ({ callback = () => { }, element = {} }) => {

  const current = element?.current;

  const observer = useRef(null);

  useEffect(() => {
    // if we are already observing old element
    const el = current
    if (current) {
      observer?.current?.unobserve?.(current);
    }
    observer.current = new ResizeObserver(callback);
    observe();

    return () => {
      if (el) {
        observer?.current?.unobserve?.(el);
      }
    };
  }, [current]);

  const observe = () => {
    if (element?.current) {
      observer?.current?.observe?.(element.current);
    }
  };

};

export default useResizeObserver;