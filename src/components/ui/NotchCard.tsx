
export default function PostCard() {
  return (
    <>
      {/* Style scoped uniquement pour l'effet hover title_el + hover card */}
      <style>{`
        #post-2839-title-el {
          background-image: linear-gradient(currentColor, currentColor);
          background-position: 0% 100%;
          background-repeat: no-repeat;
          background-size: 0% 1px;
          text-decoration: none;
          transition-property: background-size;
          transition-duration: 0.3s;
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        #post-2839:hover #post-2839-title-el,
        #post-2839:focus-visible #post-2839-title-el {
          background-size: 100% 1px;
        }
        #post-2839:hover .post-2839-btn-icon,
        #post-2839:focus-visible .post-2839-btn-icon {
          transform: scale(0.875);
        }
      `}</style>

      <a
        id="post-2839"
        href="#"
        aria-label="Deep learning–enabled discovery of antibiotics effective against\u00a0Neisseria gonorrhoeae"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          alignItems: "stretch",
          color: "#222f30",
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          minHeight: "300px",
          opacity: 1,
          overflow: "hidden",
          padding: "26px 32px",
          position: "relative",
          rowGap: "24px",
          width: "100%",
          height: "auto",
          textDecoration: "none",
          transform: "translate(0px, 0px)",
          backgroundColor: "#F5EFE6",
          borderRadius: "20px",
          boxSizing: "border-box",
          fontFamily:
            "Aspekta, -apple-system, BlinkMacSystemFont, 'avenir next', avenir, 'segoe ui', 'helvetica neue', helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: 1.4,
          letterSpacing: "-0.1px",
          cursor: "pointer",
        }}
      >
        {/* item_meta */}
        <div
          style={{
            alignItems: "center",
            columnGap: "10px",
            display: "flex",
            flex: "0 0 auto",
            justifyContent: "space-between",
            position: "relative",
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* meta_type u-ts--1 */}
          <div
            style={{
              alignItems: "center",
              background: "#f7f7f5",
              borderRadius: "8px",
              color: "#222f30",
              display: "inline-flex",
              fontFamily:
                "'Roboto Mono', Menlo, Consolas, Monaco, 'Liberation Mono', 'Lucida Console', monospace",
              fontSize: "0.75rem",
              letterSpacing: 0,
              lineHeight: "1em",
              padding: "8px 12px 8px 8px",
              textTransform: "uppercase",
              width: "fit-content",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                background: "#a7e26e",
                display: "inline-flex",
                marginTop: "auto",
                marginBottom: "auto",
                marginRight: "12px",
                width: "10px",
                height: "10px",
                flexShrink: 0,
              }}
            />
            Publications
          </div>

          {/* meta_date */}
          <time
            style={{
              color: "#222f30",
              fontFamily:
                "'Roboto Mono', Menlo, Consolas, Monaco, 'Liberation Mono', 'Lucida Console', monospace",
              fontSize: "0.8125rem",
              letterSpacing: "-0.02em",
              lineHeight: "1em",
              opacity: 0.5,
              textTransform: "uppercase",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            August 6, 2026
          </time>
        </div>

        {/* item_title h6 */}
        <h6
          style={{
            flex: "1 1 auto",
            fontSize: "1.375rem",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: "1.3em",
            position: "relative",
            textTransform: "none",
            zIndex: 1,
            margin: 0,
            padding: 0,
            fontFamily:
              "Aspekta, -apple-system, BlinkMacSystemFont, 'avenir next', avenir, 'segoe ui', 'helvetica neue', helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif",
          }}
        >
          {/* id unique pour cibler via la <style> scoped sans affecter d'autres éléments */}
          <span id="post-2839-title-el">
            Deep learning–enabled discovery of antibiotics effective
            against&nbsp;Neisseria gonorrhoeae
          </span>
        </h6>

        {/* item_foot */}
        <div
          style={{
            alignItems: "flex-end",
            columnGap: "8px",
            display: "flex",
            flex: "0 0 auto",
            justifyContent: "space-between",
            position: "relative",
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* foot_label */}
          <div
            style={{
              alignItems: "flex-end",
              display: "inline-flex",
              flex: "1 1 auto",
              flexWrap: "wrap",
              fontFamily:
                "'Roboto Mono', Menlo, Consolas, Monaco, 'Liberation Mono', 'Lucida Console', monospace",
              fontSize: "0.8125rem",
              justifyContent: "flex-start",
              gap: "4px",
              letterSpacing: "-0.02em",
              lineHeight: "1em",
              paddingBottom: "0",
              textTransform: "uppercase",
            }}
          >
            Read article
          </div>
        </div>

        {/* item_background figure */}
        <figure
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px 20px 0 20px",
            clipPath:
              "polygon(100% 0, 100% calc(100% - 75px), calc(100% - 75px) calc(100% - 75px), calc(100% - 75px) 100%, 0 100%, 0 0)",
            margin: 0,
            top: 0,
            left: 0,
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />

        {/* item_btn */}
        <div
          style={{
            right: 0,
            bottom: 0,
            position: "absolute",
            zIndex: 1,
            width: "87px",
            height: "90px",
          }}
        >
          {/* btn_el */}
          <div
            style={{
              right: 0,
              bottom: 0,
              position: "absolute",
              zIndex: 1,
              pointerEvents: "none",
              width: "51px",
              height: "48px",
              display: "inline-flex",
              fontWeight: 400,
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
              padding: 0,
              background: "transparent",
              borderRadius: 0,
              userSelect: "none",
            }}
          >
            {/* btn_icon — classe pour le hover scale via <style> scoped */}
            <i
              className="post-2839-btn-icon"
              style={{
                backgroundColor: "transparent",
                overflow: "hidden",
                padding: "10px",
                position: "relative",
                width: "100%",
                height: "100%",
                transform: "scale(1)",
                transformOrigin: "center",
                display: "block",
                fontStyle: "normal",
                transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="51"
                height="48"
                fill="none"
                viewBox="0 0 51 48"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
              >
                <path
                  fill="currentColor"
                  d="M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z"
                />
              </svg>
            </i>
          </div>

          {/* btn_bg */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="87"
            height="90"
            fill="none"
            viewBox="0 0 87 90"
            style={{
              right: 0,
              bottom: 0,
              position: "absolute",
              zIndex: 1,
              width: "100%",
              height: "100%",
            }}
          >
            <path
              fill="#fff"
              d="M35.43 45.104 23.71 81.57A12.146 12.146 0 0 1 12.145 90C5.438 90 0 84.562 0 77.854V16C0 7.163 7.163 0 16 0h55c8.837 0 16 7.163 16 16v2c0 8.837-7.163 16-16 16H50.663a16 16 0 0 0-15.232 11.104Z"
            />
          </svg>
        </div>
      </a>
    </>
  );
}