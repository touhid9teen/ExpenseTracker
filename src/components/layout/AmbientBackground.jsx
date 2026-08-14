/**
 * AmbientBackground – full-page fixed backdrop. Dark mode gets the
 * cyan/violet aurora blobs + cyber grid; light mode gets a full-page
 * vertical gradient (white → purple → white) with a subtle grid.
 */
const AmbientBackground = ({ darkMode }) =>
  darkMode ? (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 aurora-bg"
    >
      <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-cyan-500/10 blur-[110px] aurora-blob" />
      <div
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-violet-500/10 blur-[110px] aurora-blob"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 blur-[110px] aurora-blob"
        style={{ animationDelay: "-14s" }}
      />
      <div className="absolute inset-0 cyber-grid opacity-70" />
    </div>
  ) : (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 aurora-bg-light-pink"
    >
      <div className="absolute inset-0 cyber-grid-light" />
    </div>
  );

export default AmbientBackground;
