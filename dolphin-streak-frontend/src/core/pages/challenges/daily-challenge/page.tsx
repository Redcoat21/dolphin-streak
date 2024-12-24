"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FillInTheBlankPage } from "@/core/components/courses/fill-in-the-blank";
import { Calendar } from "@/components/ui/calendar";

export function DailyChallengePage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [today, setToday] = useState<Date>(new Date());

  useEffect(() => {
    // Update today's date in state to re-render the calendar if the day changes
    const interval = setInterval(() => {
      setToday(new Date());
    }, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(interval);
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isSameDay(date, today)) {
      setSelectedDate(date);
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth(
      direction === "prev"
        ? subMonths(currentMonth, 1)
        : addMonths(currentMonth, 1),
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Daily Challenge</h1>

      <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          fromDate={new Date("2023-01-01")} // Example: Set a minimum date
          toDate={today}
          disabled={(date) => !isSameDay(date, today)} // Disable all other dates except today
          modifiers={{
            today: {
              backgroundColor: "blue", // Highlight today's date
              color: "white",
            },
          }}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              "hover:bg-accent hover:text-accent-foreground",
              "disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-50", // Disabled styles
              "focus:bg-accent focus:text-accent-foreground",
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-blue-500 text-white",
            day_outside: "text-muted-foreground opacity-50",
          }}
        />
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-center">
            Challenge for {format(selectedDate, "PPPP")}
          </h2>
          <FillInTheBlankPage />
        </div>
      )}
    </div>
  );
}