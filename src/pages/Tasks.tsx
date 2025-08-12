import { useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Design Ben 10 intro animation", done: false },
    { id: 2, text: "Wire mic controls", done: true },
    { id: 3, text: "Leaderboard polish", done: false },
  ]);
  return (
    <div className="card-omni p-6">
      <h2 className="font-heading text-xl mb-4">Tasks</h2>
      <ul className="space-y-3">
        {tasks.map(t => (
          <li key={t.id} className="flex items-center gap-3">
            <input type="checkbox" className="size-4" checked={t.done} onChange={()=> setTasks(s=> s.map(x=> x.id===t.id?{...x,done:!x.done}:x))} />
            <span className={t.done?"line-through text-muted-foreground":""}>{t.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
