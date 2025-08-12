import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Projects() {
  const projects = [
    { title: "Omnitrix UI", desc: "Polish neon UI and micro-interactions", progress: 72 },
    { title: "Voice Engine", desc: "Tune TTS and recognition flow", progress: 54 },
    { title: "Question Engine", desc: "Improve prompt and anti-repeat", progress: 63 },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {projects.map((p) => (
        <Card key={p.title} className="card-omni">
          <CardHeader>
            <CardTitle className="font-heading">{p.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{p.desc}</p>
            <Progress value={p.progress} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
