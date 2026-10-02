/**
 * The hero's backdrop: slow-drifting teal light over a faint grid that fades out toward the
 * edges. Pure CSS, transform-only animation, and still under reduced motion (see global.css).
 */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="resumora-grid absolute inset-0" />
      <div className="resumora-aurora resumora-aurora-a" />
      <div className="resumora-aurora resumora-aurora-b" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-fd-background" />
    </div>
  );
}
