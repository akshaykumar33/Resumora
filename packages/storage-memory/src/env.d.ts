// Compiled against the ES library only, like core: the adapter runs in browsers, Node, Deno and
// Bun alike. The one host API it uses is declared here.

declare function setTimeout(callback: () => void, delayMs?: number): unknown;
