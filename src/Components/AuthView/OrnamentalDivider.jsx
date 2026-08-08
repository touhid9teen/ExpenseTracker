/**
 * Divider — a thin straight vertical line with spiral curl flourishes.
 * The top has a left spiral joined by a right spiral sitting just above it
 * (with a short straight stem); the bottom mirrors that — a right spiral
 * joined by a left spiral sitting just below it (also with a short stem).
 * Separates the login page's dashboard image from the sign-in form.
 *
 * Color is inherited from `currentColor` — pass a light-purple text class
 * (e.g. `text-violet-400`) to the component.
 */
const OrnamentalDivider = ({ className = "" }) => (
  <svg
    viewBox="0 0 80 540"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main stroke: left-top spiral + straight line + bottom-right spiral */}
    <path
      d="M25 90
         C 29 89, 30 93, 26 94
         C 22 95, 20 90, 25 89
         C 33 87, 34 97, 25 98
         C 16 99, 14 88, 23 84
         C 31 81, 38 86, 40 90
         L 40 420
         C 42 424, 49 429, 57 426
         C 66 422, 64 411, 55 412
         C 46 413, 47 423, 55 421
         C 60 420, 58 415, 54 416
         C 50 417, 51 421, 55 420"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right spiral sits a little above the left spiral — its short stem
        drops down to meet the main line. */}
    <path
      d="M55 65
         C 51 64, 50 68, 54 69
         C 58 70, 60 65, 55 64
         C 47 62, 46 72, 55 73
         C 64 74, 66 63, 57 59
         C 49 56, 42 61, 40 65
         L 40 90"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left spiral sits a little below the right spiral — its short stem
        rises up to meet the main line (mirrors the top). */}
    <path
      d="M25 445
         C 29 446, 30 442, 26 441
         C 22 440, 20 445, 25 446
         C 33 448, 34 438, 25 437
         C 16 436, 14 447, 23 451
         C 31 454, 38 449, 40 445
         L 40 420"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OrnamentalDivider;
