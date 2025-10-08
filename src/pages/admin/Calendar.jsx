import React, { useState } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export default function Calendar() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push(d);
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={prevMonth}
                >
                    &lt;
                </button>
                <h2 className="text-xl font-bold">
                    {today.toLocaleString("default", { month: "long" })}
                    {" "}
                    {currentYear}
                </h2>
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={nextMonth}
                >
                    &gt;
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-600">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => (
                    <div
                        key={idx}
                        className={`h-12 flex items-center justify-center rounded ${
                            day === today.getDate() &&
                            currentMonth === today.getMonth() &&
                            currentYear === today.getFullYear()
                                ? "bg-blue-500 text-white font-bold"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {day ? day : ""}
                    </div>
                ))}
            </div>
        </div>
    );
}