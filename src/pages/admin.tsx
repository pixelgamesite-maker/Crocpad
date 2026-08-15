import { useEffect, useRef, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { color, font, RULE, offset } from "@/lib/theme";
import { CROCSPAD_ADDRESS, CROCSPAD_ABI, ALLOWLIST_API_URL } from "@/lib/crocsPadContract";

type GenResult = { root: string; count: number; skippedCount: number; skipped: string[] };

const KEY_STORAGE = "crocpad_admin_key";

export default function Admin() {
  const { address, isConnected } = useAccount();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: owner } = useReadContract({
    address: CROCSPAD_ADDRESS,
    abi: CROCSPAD_ABI,
    functionName: "owner",
  });

  const isOwner =
    isConnected && !!address && typeof owner === "string" && owner.toLowerCase() === address.toLowerCase();

  const [adminKey, setAdminKey] = useState("");
  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE);
    if (saved) setAdminKey(saved);
  }, []);
  useEffect(() => {
    if (adminKey) sessionStorage.setItem(KEY_STORAGE, adminKey);
  }, [adminKey]);

  const [fileName, setFileName] = useState("");
  const [csvText, setCsvText] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<GenResult | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  async function generate() {
    if (!csvText.trim() || !adminKey.trim()) return;
    setStatus("generating");
    setErrorMsg("");
    try {
      const res = await fetch(`${ALLOWLIST_API_URL}/admin/allowlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminKey.trim()}` },
        body: JSON.stringify({ csv: csvText }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Request failed.");
      setResult(body);
      setStatus("idle");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Something went wrong.");
      setStatus("error");
    }
  }

  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function setRootOnChain() {
    if (!result) return;
    reset();
    writeContract({
      address: CROCSPAD_ADDRESS,
      abi: CROCSPAD_ABI,
      functionName: "setMerkleRoot",
      args: [result.root as `0x${string}`],
    });
  }

  const input: React.CSSProperties = {
    width: "100%", padding: "11px 12px", border: RULE, background: color.paper,
    fontFamily: font.mono, fontSize: "0.8rem", color: color.ink, outline: "none",
  };

  if (!isConnected) {
    return (
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "90px 22px", textAlign: "center" }}>
        <p style={{ fontFamily: font.mono, color: color.inkSoft }}>Connect the owner wallet to continue.</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "90px 22px", textAlign: "center" }}>
        <p style={{ fontFamily: font.mono, color: color.tongue }}>This wallet isn't the contract owner.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "50px 22px 90px" }}>
      <p style={{ fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 12px" }}>
        Owner only
      </p>
      <h1 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "2.6rem", letterSpacing: "-0.03em", margin: "0 0 30px" }}>
        Allowlist
      </h1>

      {/* step 1: admin key */}
      <section style={{ border: RULE, background: color.paper, marginBottom: "20px" }}>
        <div style={{ padding: "13px 18px", borderBottom: RULE }}>
          <span style={{ fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.14em", textTransform: "uppercase", color: color.inkSoft }}>
            1 · Admin key
          </span>
        </div>
        <div style={{ padding: "18px" }}>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Paste ADMIN_API_KEY"
            style={input}
          />
          <p style={{ fontFamily: font.mono, fontSize: "0.66rem", color: color.inkFaint, margin: "10px 0 0", lineHeight: 1.5 }}>
            Kept only in this browser tab's session storage. Never appears in the site's source code.
          </p>
        </div>
      </section>

      {/* step 2: csv */}
      <section style={{ border: RULE, background: color.paper, marginBottom: "20px" }}>
        <div style={{ padding: "13px 18px", borderBottom: RULE }}>
          <span style={{ fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.14em", textTransform: "uppercase", color: color.inkSoft }}>
            2 · Wallet list
          </span>
        </div>
        <div style={{ padding: "18px" }}>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: "none" }} />
          <button
            onClick={() => fileRef.current?.click()}
            className="press"
            style={{ width: "100%", padding: "14px", border: RULE, background: color.paperDeep, fontFamily: font.mono, fontSize: "0.82rem", cursor: "pointer" }}
          >
            {fileName || "Choose CSV file"}
          </button>
          {csvText && (
            <p style={{ fontFamily: font.mono, fontSize: "0.7rem", color: color.inkSoft, margin: "10px 0 0" }}>
              {csvText.split(/\r?\n/).filter((l) => l.trim()).length} lines loaded.
            </p>
          )}
        </div>
      </section>

      {/* step 3: generate */}
      <button
        onClick={generate}
        disabled={!csvText.trim() || !adminKey.trim() || status === "generating"}
        className={csvText.trim() && adminKey.trim() ? "press" : undefined}
        style={{
          width: "100%", padding: "18px", border: RULE, marginBottom: "16px",
          fontFamily: font.display, fontWeight: 800, fontSize: "1rem",
          cursor: csvText.trim() && adminKey.trim() ? "pointer" : "not-allowed",
          background: csvText.trim() && adminKey.trim() ? color.ink : color.paperDeep,
          color: csvText.trim() && adminKey.trim() ? color.paper : color.inkFaint,
          boxShadow: csvText.trim() && adminKey.trim() ? offset(color.croc, 5, 5) : "none",
        }}
      >
        {status === "generating" ? "Building tree…" : "Generate & store"}
      </button>

      {status === "error" && (
        <p style={{ fontFamily: font.mono, fontSize: "0.76rem", color: color.tongue, marginBottom: "16px" }}>{errorMsg}</p>
      )}

      {/* result + on-chain step */}
      {result && (
        <section style={{ border: RULE, background: color.croc, color: color.paper, marginBottom: "20px" }}>
          <div style={{ padding: "18px" }}>
            <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.1rem", margin: "0 0 6px" }}>
              {result.count} wallets stored
            </p>
            {result.skippedCount > 0 && (
              <p style={{ fontFamily: font.mono, fontSize: "0.72rem", margin: "0 0 10px", opacity: 0.85 }}>
                {result.skippedCount} line(s) skipped — not valid addresses.
              </p>
            )}
            <code style={{ display: "block", fontFamily: font.mono, fontSize: "0.7rem", wordBreak: "break-all", background: "rgba(0,0,0,0.15)", padding: "10px 12px", marginTop: "10px" }}>
              {result.root}
            </code>
          </div>
        </section>
      )}

      {result && (
        <>
          <button
            onClick={setRootOnChain}
            disabled={isPending || confirming}
            className="press"
            style={{
              width: "100%", padding: "18px", border: RULE,
              fontFamily: font.display, fontWeight: 800, fontSize: "1rem",
              cursor: isPending || confirming ? "not-allowed" : "pointer",
              background: color.sun, color: color.ink,
              boxShadow: offset(color.ink, 5, 5),
            }}
          >
            {isPending ? "Confirm in wallet…" : confirming ? "Setting root…" : "3 · Set root on-chain"}
          </button>
          {writeError && (
            <p style={{ fontFamily: font.mono, fontSize: "0.74rem", color: color.tongue, marginTop: "14px" }}>
              {(writeError as any).shortMessage ?? "Transaction failed."}
            </p>
          )}
          {isSuccess && (
            <p style={{ fontFamily: font.mono, fontSize: "0.74rem", color: color.croc, marginTop: "14px" }}>
              Root set. The new list is live.
            </p>
          )}
        </>
      )}
    </div>
  );
}
