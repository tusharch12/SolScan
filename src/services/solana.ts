const RPC = "https://api.mainnet-beta.solana.com"; const rpc = async (method: string, params: any[]) => {
    const res = await fetch(RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.result;
};

export const getBalance = async (addr: string) => {
    const result = await rpc("getBalance", [addr]);
    return result.value / 1_000_000_000;
};

export const getTokens = async (addr: string) => {
    const result = await rpc("getTokenAccountsByOwner", [
        addr,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed" },
    ]);
    return (result.value || [])
        .map((a: any) => ({
            mint: a.account.data.parsed.info.mint,
            amount: a.account.data.parsed.info.tokenAmount.uiAmount,
        }))
        .filter((t: any) => t.amount > 0);
};

export const getTxns = async (addr: string) => {
    const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
    return sigs.map((s: any) => ({
        sig: s.signature,
        time: s.blockTime,
        ok: !s.err,
    }));
};


