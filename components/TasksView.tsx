import React, { useState } from 'react';
import { AppState, Task, AppNote } from '../types';
import { 
  Plus, CheckCircle2, Circle, Clock, AlertTriangle, 
  StickyNote, Trash2, Tag, Calendar as CalendarIcon, 
  LayoutList, Grid, BookOpen, CheckSquare, Search
} from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
}

const TasksView: React.FC<Props> = ({ state, updateState }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Task['category']>('General');

  const toggleTask = (id: string) => {
    updateState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      completed: false,
      category: newTaskCategory
    };
    updateState(prev => ({ ...prev, tasks: [task, ...prev.tasks] }));
    setNewTaskTitle('');
  };

  const addNote = () => {
    const note: AppNote = {
      id: Date.now().toString(),
      content: '',
      updatedAt: new Date().toISOString(),
      color: '#FFFFFF'
    };
    updateState(prev => ({ ...prev, notes: [note, ...prev.notes] }));
  };

  const deleteNote = (id: string) => {
    updateState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
  };

  const updateNoteContent = (id: string, content: string) => {
    updateState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n)
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="bg-[#F5F5F5] p-1.5 rounded-2xl flex gap-1 border border-[#D1D5D8]">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'tasks' ? 'bg-black text-white shadow-lg' : 'text-[#999] hover:text-black'}`}
          >
            <CheckSquare size={16} /> Pendientes
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'notes' ? 'bg-black text-white shadow-lg' : 'text-[#999] hover:text-black'}`}
          >
            <StickyNote size={16} /> Bitácora
          </button>
        </div>
        
        {activeTab === 'notes' && (
          <button onClick={addNote} className="p-3 bg-black text-white rounded-xl shadow-lg hover:bg-[#ff0071] transition-all accent-glow">
            <Plus size={20} />
          </button>
        )}
      </div>

      {activeTab === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="vintage-card p-8 rounded-[2.5rem] bg-white border-[#D1D5D8]">
              <h3 className="text-xl font-bold serif mb-6 flex items-center gap-3">
                 <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#D1D5D8]"><Plus size={16} className="text-[#ff0071]" /></div>
                 Quick Task
              </h3>
              <form onSubmit={addTask} className="flex gap-4">
                <input 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Tarea operativa..." 
                  className="flex-1 px-5 py-4 bg-[#F9FAFB] border border-[#D1D5D8] rounded-2xl outline-none focus:border-[#ff0071] transition-all text-sm font-medium"
                />
                <button type="submit" className="px-8 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#ff0071] transition-all">
                  Añadir
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {state.tasks.map((task) => (
                <div key={task.id} className={`vintage-card p-5 rounded-[1.5rem] flex items-center gap-5 group border-[#D1D5D8] bg-white ${task.completed ? 'opacity-40 grayscale' : ''}`}>
                  <button onClick={() => toggleTask(task.id)} className="transition-transform active:scale-90 text-[#D1D5D8] hover:text-[#ff0071]">
                    {task.completed ? <CheckCircle2 className="text-emerald-500" size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold ${task.completed ? 'line-through' : 'text-[#1A1A1A]'}`}>{task.title}</h4>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#999] flex items-center gap-1">
                        <Tag size={10} /> {task.category}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#ff0071] flex items-center gap-1">
                        <Clock size={10} /> {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 text-[#D1D5D8] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="vintage-card p-8 rounded-[2.5rem] bg-black text-white border-none accent-glow overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-bold serif text-xl mb-6">Eficiencia</h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">
                      <span>Tareas Completadas</span>
                      <span>{Math.round((state.tasks.filter(t => t.completed).length / state.tasks.length) * 100 || 0)}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#ff0071] h-full transition-all" style={{width: `${(state.tasks.filter(t => t.completed).length / state.tasks.length) * 100}%`}}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-2xl font-bold">{state.tasks.filter(t => !t.completed).length}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Pendientes</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-2xl font-bold">{state.tasks.filter(t => t.completed).length}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Cerradas</p>
                    </div>
                  </div>
                </div>
              </div>
              <CalendarIcon className="absolute -bottom-8 -right-8 opacity-5 text-white w-48 h-48" />
            </div>

            <div className="vintage-card p-7 rounded-[2rem] border-rose-100 bg-rose-50/30">
                <div className="flex items-center gap-3 mb-4 text-[#ff0071]">
                    <AlertTriangle size={18} />
                    <h4 className="font-bold text-xs uppercase tracking-widest">Bloqueadores</h4>
                </div>
                <ul className="space-y-3">
                    {state.tasks.filter(t => t.priority === 'High' && !t.completed).map(t => (
                    <li key={t.id} className="text-[11px] font-bold text-rose-900/60 leading-relaxed pl-3 border-l-2 border-[#ff0071]">
                        {t.title}
                    </li>
                    ))}
                    {state.tasks.filter(t => t.priority === 'High' && !t.completed).length === 0 && (
                        <p className="text-[10px] italic text-[#999]">No hay tareas críticas pendientes.</p>
                    )}
                </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.notes.map((note) => (
            <div 
              key={note.id} 
              className="vintage-card p-8 rounded-[2rem] min-h-[260px] flex flex-col group relative transition-all border-[#D1D5D8] bg-white hover:border-[#ff0071]"
            >
              <textarea 
                value={note.content}
                onChange={(e) => updateNoteContent(note.id, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm font-medium text-[#333] placeholder:italic"
                placeholder="Anota ideas, mezclas de colores..."
              />
              <div className="mt-6 pt-5 border-t border-[#F5F5F5] flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-[#999]">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-[#ff0071] transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          <button 
            onClick={addNote}
            className="border-2 border-dashed border-[#D1D5D8] rounded-[2rem] flex flex-col items-center justify-center p-12 text-[#999] hover:bg-white hover:border-[#ff0071] hover:text-[#ff0071] transition-all group min-h-[260px]"
          >
            <div className="p-4 bg-[#F5F5F5] rounded-2xl group-hover:bg-[#ff0071] group-hover:text-white transition-all mb-4">
                <StickyNote size={28} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Nueva Anotación</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksView;