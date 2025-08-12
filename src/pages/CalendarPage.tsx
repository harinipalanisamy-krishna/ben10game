import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function CalendarPage() {
  return (
    <div className="card-omni p-4">
      <h2 className="font-heading text-xl mb-2">Calendar</h2>
      <div className="overflow-auto">
        <DayPicker mode="single" />
      </div>
    </div>
  );
}
