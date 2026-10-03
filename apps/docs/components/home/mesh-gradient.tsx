/**
 * The hero's animated colour mesh: five large, blurred colour fields drifting on independent
 * slow paths, blended together, with a fine grain on top. Transform-only animation, held still
 * under reduced motion (see global.css). Pure CSS, so it costs nothing on the main thread.
 */
export function MeshGradient({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`resumora-mesh ${className}`}>
      <span className="resumora-blob resumora-blob-1" />
      <span className="resumora-blob resumora-blob-2" />
      <span className="resumora-blob resumora-blob-3" />
      <span className="resumora-blob resumora-blob-4" />
      <span className="resumora-blob resumora-blob-5" />
      <span className="resumora-grain" />
    </div>
  );
}
