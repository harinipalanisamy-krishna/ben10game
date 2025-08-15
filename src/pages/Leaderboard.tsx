import creator1 from "@/assets/creator-1.png";
import creator2 from "@/assets/creator-2.png";

export default function Leaderboard() {
  const data: Array<{name:string;score:number;date:string}> = JSON.parse(sessionStorage.getItem("leaderboard") || "[]");
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="card-omni p-6">
        <h2 className="font-heading text-xl mb-4">Top 10 Leaderboard</h2>
        <ol className="space-y-2">
          {data.length === 0 && <p className="text-muted-foreground">No scores yet. Be the first!</p>}
          {data.map((r, i) => (
            <li key={i} className="flex items-center justify-between border-b py-2">
              <span className="text-sm">{i+1}. {r.name}</span>
              <span className="font-semibold text-primary">{r.score}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <a href="/" className="btn-neon">Play Again</a>
        </div>
      </section>
      <section className="card-omni p-6">
        <h3 className="font-heading text-lg mb-3">Created By</h3>
        <div className="grid grid-cols-2 gap-4">
          <figure className="rounded-lg overflow-hidden border">
            <img src={creator1} alt="Abijth - Developer" loading="lazy" className="w-full h-32 object-cover" />
            <figcaption className="p-2 text-center text-xs text-muted-foreground">Abijth</figcaption>
          </figure>
          <figure className="rounded-lg overflow-hidden border">
            <img src={creator2} alt="Aniruth - Developer" loading="lazy" className="w-full h-32 object-cover" />
            <figcaption className="p-2 text-center text-xs text-muted-foreground">Aniruth</figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
