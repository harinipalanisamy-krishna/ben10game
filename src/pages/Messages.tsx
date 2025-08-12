import { useState } from "react";

export default function Messages() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Array<{id:number;text:string;me?:boolean}>>([
    { id: 1, text: "Welcome to AI Mastermind!" },
  ]);
  const send = () => { if(!input) return; setMsgs(s=>[...s,{id:Date.now(),text:input,me:true}]); setInput(""); };
  return (
    <div className="card-omni p-6 flex flex-col gap-4">
      <h2 className="font-heading text-xl">Messages</h2>
      <div className="flex-1 min-h-64 border rounded-lg p-3 space-y-2 bg-background/70">
        {msgs.map(m=> (
          <div key={m.id} className={`max-w-[70%] px-3 py-2 rounded-md ${m.me?"ml-auto bg-primary text-primary-foreground":"bg-muted"}`}>{m.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-md bg-background border px-3" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message" />
        <button className="btn-neon" onClick={send}>Send</button>
      </div>
    </div>
  );
}
