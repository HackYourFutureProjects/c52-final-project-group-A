import { useEffect, useState } from "react";

const useWindowWidth = (width) => {
  const [match, setMatch] = useState(() => window.innerWidth <= width);

  useEffect(() => {
    const handleResize = () => {
      setMatch(window.innerWidth <= width);
    };

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);
  return match;
};

export default useWindowWidth;
