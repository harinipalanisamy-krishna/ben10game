import creatorReal from "@/assets/creator-real.jpg";

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
        <div className="flex justify-center">
          <figure className="rounded-lg overflow-hidden border max-w-xs">
            <img src={creatorReal} alt="Ben 10 Game Creator" loading="lazy" className="w-full h-48 object-cover animate-fade-in" />
            <figcaption className="p-3 text-center text-sm text-muted-foreground">
              Ben 10 Quiz Game Creator
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
