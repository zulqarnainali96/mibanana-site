import { useEffect, useRef } from 'react';

export function useOnClickOutside(ref, callback) {
  const handleClickOutside = (event) => {
    if (ref.current && ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [ref, callback]);
}

