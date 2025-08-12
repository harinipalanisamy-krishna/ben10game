import MainLayout from "@/layouts/MainLayout";
import Game from "@/pages/Game";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import CalendarPage from "@/pages/CalendarPage";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Leaderboard from "@/pages/Leaderboard";

export default function Index({ page }: { page?: string }) {
  return (
    <MainLayout>
      {(!page || page === "home") && <Game />}
      {page === "projects" && <Projects />}
      {page === "tasks" && <Tasks />}
      {page === "calendar" && <CalendarPage />}
      {page === "messages" && <Messages />}
      {page === "settings" && <Settings />}
      {page === "leaderboard" && <Leaderboard />}
    </MainLayout>
  );
}
