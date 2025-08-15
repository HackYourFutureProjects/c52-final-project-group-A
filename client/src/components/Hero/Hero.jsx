import { Link } from "react-router-dom";
import style from "./Hero.module.css";
import { useMemo } from "react";

export default function Hero() {
  const tags = [
    "#Tech",
    "#AI",
    "#Philosophy",
    "#Startups",
    "#Code",
    "#Writing",
    "#Design",
    "#Politics",
    "#Poetry",
    "#Ideas",
  ];

  // Generate random positions and delays once
  const floatingTags = useMemo(() => {
    return tags.map((tag) => {
      const left =
        Math.random() < 0.5 ? Math.random() * 30 : 70 + Math.random() * 30;

      const top = Math.random() * 80;
      const delay = Math.random() * 5;

      return { tag, left, top, delay };
    });
  }, []);

  return (
    <section className={style.hero}>
      <div className={style.heroInner}>
        <h1 className={style.heroTitle}>
          <span className={`${style.heroLine} ${style.fadeLeft}`}>
            The best
          </span>
          <span className={`${style.heroLine} ${style.fadeLeft}`}>
            <span className={style.heroDot} />
            place
          </span>
          <span className={`${style.heroLine} ${style.fadeRight}`}>
            for <span className={style.heroUnderline}>your</span>{" "}
            <span className={style.heroPill}>ideas</span>
          </span>
        </h1>

        <p className={`${style.heroSubTitle} ${style.fadeUp} ${style.delay1}`}>
          Share bold thoughts. Discover rising creators.
        </p>

        <div className={`${style.heroCta} ${style.fadeUp} ${style.delay2}`}>
          <Link to="/explore" className={`${style.btn} ${style.btnPrimary}`}>
            Explore
          </Link>
          <Link to="/signup" className={`${style.btn} ${style.btnGhost}`}>
            Sign up
          </Link>
        </div>
      </div>

      <div className={style.tagCloud}>
        {floatingTags.map(({ tag, left, top, delay }, index) => (
          <span
            key={index}
            className={style.floatingTag}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
