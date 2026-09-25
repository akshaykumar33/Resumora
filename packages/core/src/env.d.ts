// Core compiles against the ES library only, with no DOM or Node types, so a reference to
// `window`, `localStorage` or `indexedDB` fails to type-check. The only host globals it may use
// are declared here: the WHATWG encoding API, which browsers, Node, Deno and Bun all provide.

declare class TextEncoder {
  encode(input?: string): Uint8Array;
}

declare class TextDecoder {
  decode(input?: Uint8Array): string;
}
