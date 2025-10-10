import React, { useState, useEffect } from "react";
import { getEventsForMonthRequest } from "../../services/calendar.js"; 

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function Calendar() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [occupiedDates, setOccupiedDates] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString("es-ES", { month: "long" });

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await getEventsForMonthRequest(currentYear, currentMonth + 1);
                const dates = new Set(response.data.map(event => event.eventDate));
                setOccupiedDates(dates);
            } catch (error) {
                console.error("Error al cargar los eventos del calendario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentMonth, currentYear]);

    const changeMonth = (amount) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const renderCalendarDays = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="border-t border-l border-transparent"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isOccupied = occupiedDates.has(dateStr);

            let dayClass = "h-20 flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-200 ease-in-out border";
            if (isToday) {
                dayClass += " bg-amber-600 text-white font-bold shadow-lg scale-105";
            } else if (isOccupied) {
                dayClass += " bg-red-200 bg-opacity-70 text-red-900 font-semibold cursor-not-allowed border-red-300";
            } else {
                dayClass += " bg-white bg-opacity-50 text-amber-900 hover:bg-amber-100 hover:shadow-md border-amber-100";
            }

            days.push(
                <div key={day} className={dayClass}>
                    <span>{day}</span>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 lg:p-8">
            <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                <div className="flex justify-between items-center mb-6">
                     <button onClick={() => changeMonth(-1)} className="p-2 rounded-full text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-900 capitalize tracking-wide">
                        {monthName} {currentYear}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-center font-bold text-amber-700 text-sm pb-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className={`grid grid-cols-7 gap-2 relative ${loading ? 'opacity-50' : ''}`}>
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-lg">
                            <p className="font-semibold text-amber-800 animate-pulse">Cargando...</p>
                        </div>
                    )}
                    {renderCalendarDays()}
                </div>
                <div className="flex justify-end space-x-4 mt-6 text-sm text-amber-800">
                    <div className="flex items-center"><span className="w-4 h-4 bg-white border border-amber-200 rounded-full mr-2"></span>Disponible</div>
                    <div className="flex items-center"><span className="w-4 h-4 bg-red-200 border border-red-300 rounded-full mr-2"></span>Ocupado</div>
                </div>
            </div>
        </div>
    );
}