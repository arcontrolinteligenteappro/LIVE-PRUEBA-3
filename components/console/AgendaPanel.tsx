
import React, { useState } from 'react';
import { es } from '../../localization';
import { IconPlus, IconTrash } from '../Icons';

const Calendar: React.FC<{ date: Date, setDate: (d: Date) => void }> = ({ date, setDate }) => {
    const today = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <button onClick={prevMonth} className="px-2 py-1 bg-gray-700 rounded">&lt;</button>
                <h4 className="font-bold">{date.toLocaleString('default', { month: 'long' })} {year}</h4>
                <button onClick={nextMonth} className="px-2 py-1 bg-gray-700 rounded">&gt;</button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-gray-400">
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm mt-1">
                {blanks.map((_, i) => <div key={`b-${i}`}></div>)}
                {days.map(day => {
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    return <div key={day} className={`p-1 rounded-full ${isToday ? 'bg-blue-600 text-white' : ''}`}>{day}</div>
                })}
            </div>
        </div>
    );
};

interface Note { id: number; text: string; }

const AgendaPanel: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [notes, setNotes] = useState<Note[]>([{id: 1, text: "10:00 AM: Pre-show check"}, {id: 2, text: "10:30 AM: Guest sound check"}]);
    const [newNote, setNewNote] = useState('');

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (newNote.trim()) {
            setNotes([...notes, { id: Date.now(), text: newNote.trim() }]);
            setNewNote('');
        }
    };
    
    const removeNote = (id: number) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const upcomingStreams = [
        { date: 'Mañana, 11:00 AM', title: 'Entrevista con Experto' },
        { date: 'Viernes, 7:00 PM', title: 'Noche de Gaming: Finales' },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">{es.agendaPanelTitle}</h3>
            
            <div className="p-3 bg-gray-700/50 rounded-lg">
                <Calendar date={currentDate} setDate={setCurrentDate} />
            </div>

            <div className="p-3 bg-gray-700/50 rounded-lg">
                <h4 className="font-bold mb-2">{es.notesForToday}</h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                    {notes.map(note => (
                        <div key={note.id} className="flex justify-between items-center text-xs bg-gray-900/50 p-1.5 rounded">
                           <span>- {note.text}</span>
                           <button onClick={() => removeNote(note.id)}><IconTrash className="w-4 h-4 text-red-500/70 hover:text-red-500"/></button>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddNote} className="flex space-x-2 mt-2">
                    <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Nueva nota..." className="w-full bg-gray-900 border border-gray-600 rounded-md px-2 py-1 text-xs"/>
                    <button type="submit" className="p-1.5 bg-blue-600 rounded"><IconPlus className="w-4 h-4"/></button>
                </form>
            </div>
            
            <div className="p-3 bg-gray-700/50 rounded-lg">
                <h4 className="font-bold mb-2">{es.upcomingStreams}</h4>
                 <div className="space-y-2">
                    {upcomingStreams.map(stream => (
                        <div key={stream.title} className="text-xs">
                            <span className="font-semibold text-blue-400">{stream.date}:</span>
                            <span className="ml-2 text-gray-300">{stream.title}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default AgendaPanel;
