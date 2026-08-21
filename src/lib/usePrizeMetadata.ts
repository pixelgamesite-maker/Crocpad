import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

const TOKEN_URI_ABI = [
  { type: "function", name: "tokenURI", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "string" }] },
] as const;

/** Any project's NFT could use ipfs:// links — resolve through a public
 *  gateway so the browser can actually fetch them. Best-effort: we don't
 *  control how external projects pinned their content, so a failure
 *  here just falls back to showing contract + token ID as text instead
 *  of a broken image. */
function resolveIpfsUrl(uri: string): string {
  if (uri.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  return uri;
}

export type PrizeMetadata = {
  loading: boolean;
  image: string | null;
  name: string | null;
  error: boolean;
};

export function usePrizeMetadata(nftContract: string, tokenId: bigint): PrizeMetadata {
  const [state, setState] = useState<PrizeMetadata>({ loading: true, image: null, name: null, error: false });

  const { data: uri } = useReadContract({
    address: nftContract as `0x${string}`,
    abi: TOKEN_URI_ABI,
    functionName: "tokenURI",
    args: [tokenId],
  });

  useEffect(() => {
    if (!uri) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    (async () => {
      try {
        const metaUrl = resolveIpfsUrl(uri as string);
        const res = await fetch(metaUrl);
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        if (cancelled) return;
        setState({
          loading: false,
          image: json.image ? resolveIpfsUrl(json.image) : null,
          name: json.name ?? null,
          error: false,
        });
      } catch {
        if (!cancelled) setState({ loading: false, image: null, name: null, error: true });
      }
    })();

    return () => { cancelled = true; };
  }, [uri]);

  return state;
}
