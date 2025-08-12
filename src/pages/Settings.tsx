import { useEffect, useState } from "react";

export default function Settings() {
  const [key, setKey] = useState<string>(sessionStorage.getItem("OPENAI_API_KEY") || "");
  useEffect(()=>{ document.title = "Voice of Knowledge — Settings"; },[]);
  return (
    <div className="card-omni p-6">
      <h2 className="font-heading text-xl mb-2">Settings</h2>
      <p className="text-sm text-muted-foreground mb-4">Paste your OpenAI API key to enable live AI question generation on each level. Stored only in session for this browser tab.</p>
      <input
        className="w-full rounded-md bg-background border px-3 py-2"
        placeholder="sk-..."
        value={key}
        onChange={(e)=>setKey(e.target.value)}
        onBlur={()=> sessionStorage.setItem("OPENAI_API_KEY", key)}
        aria-label="OpenAI API key"
      />
      <p className="text-xs text-muted-foreground mt-3">Security: Keys in frontend are visible to users; prefer a server proxy in production. This demo keeps it local per your request.</p>
    </div>
  );
}
