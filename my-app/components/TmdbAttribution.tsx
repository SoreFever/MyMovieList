export default function TmdbAttribution() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "2rem 1rem",
        fontSize: 12,
        opacity: 0.7,
      }}
    >
      <img
        src={"@/public/tmdb_logo.svg"}
        alt="TMDB logo"
        style={{ height: 14, width: "auto", display: "inline-block" }}
      />
      <p style={{ marginTop: 8 }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB
      </p>
    </footer>
  );
}
