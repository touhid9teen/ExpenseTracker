/**
 * AppLoader – the boot-time loading indicator.
 *
 * A "rotating lines" spinner: a ring of purple bars rotating around the
 * center with a soft fading trail. No background — it floats, centered,
 * over whatever is behind it.
 */
const AppLoader = () => {
  const BARS = 12;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="relative h-16 w-16 animate-spin [animation-duration:1.3s]">
        {Array.from({ length: BARS }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-4 w-[5px] rounded-full bg-gradient-to-b from-purple-400 via-violet-500 to-violet-700"
            style={{
              transform: `translate(-50%, -50%) rotate(${(360 / BARS) * i}deg) translateY(-20px)`,
              opacity: 0.15 + (i / BARS) * 0.85,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AppLoader;
