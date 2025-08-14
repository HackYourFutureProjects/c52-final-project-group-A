import { Link } from "react-router-dom";
import "./HeroStyles.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">
          <span className="hero__line fade-left">The best</span>
          <span className="hero__line fade-left">
            <span className="hero__dot" />
            place
          </span>
          <span className="hero__line fade-right">
            for <span className="hero__underline">your</span>{" "}
            <span className="hero__pill">ideas</span>
          </span>
        </h1>

        <p className="hero__subtitle fade-up delay-1">
          Share bold thoughts. Discover rising creators.
        </p>

        <div className="hero__cta fade-up delay-2">
          <Link to="/explore" className="btn btn--primary">
            Explore
          </Link>
          <Link to="/signup" className="btn btn--ghost">
            Sign up
          </Link>
        </div>
      </div>
      <div className="tag-cloud">
        {[
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
        ].map((tag, index) => {
          // Constrain left to either 0–30% or 70–100%
          const leftZone =
            Math.random() < 0.5
              ? Math.random() * 30 // Left side: 0–30%
              : 70 + Math.random() * 30; // Right side: 70–100%

          return (
            <span
              key={index}
              className="floating-tag"
              style={{
                animationDelay: `${Math.random() * 5}s`,
                left: `${leftZone}%`,
                top: `${Math.random() * 80}%`,
              }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </section>
  );
}
