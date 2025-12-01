
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Card, Button, Badge, Modal } from '../../components/UI';
import { 
  CheckCircle, Circle, Trash2, Plus, Calendar, Video, Phone, Users, 
  FileText, File, Upload, Download, Search, Clock 
} from 'lucide-react';
import { Meeting, Task, Note, FileItem, MeetingType } from '../../types';

// --- MEETINGS MODULE ---
export const MeetingsModule: React.FC = () => {
  const { meetings, addMeeting, removeMeeting } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '', type: 'Google Meet', startTime: '', link: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeeting.title && newMeeting.startTime) {
      addMeeting({ ...newMeeting, id: Date.now().toString() } as Meeting);
      setIsModalOpen(false);
      setNewMeeting({ title: '', type: 'Google Meet', startTime: '', link: '' });
    }
  };

  const getIcon = (type: MeetingType) => {
    switch(type) {
      case 'Zoom':
      case 'Google Meet': return <Video size={18} className="text-blue-500" />;
      case 'WhatsApp': 
      case 'Phone': return <Phone size={18} className="text-green-500" />;
      default: return <Users size={18} className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Meetings</h2>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-2" /> Schedule</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map(meeting => (
          <Card key={meeting.id} className="p-4 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg">{getIcon(meeting.type)}</div>
                <div>
                   <h3 className="font-bold text-sm text-txt-primary-light dark:text-txt-primary-dark">{meeting.title}</h3>
                   <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{meeting.type}</p>
                </div>
              </div>
              <button onClick={() => removeMeeting(meeting.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark">
                <Clock size={14} />
                {new Date(meeting.startTime).toLocaleString()}
              </div>
            </div>
            {meeting.link && (
               <a href={meeting.link} target="_blank" rel="noreferrer" className="block w-full text-center py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30">
                 Join Meeting
               </a>
            )}
          </Card>
        ))}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Meeting">
        <form onSubmit={handleAdd} className="space-y-4">
           <input type="text" placeholder="Meeting Title" required className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} />
           <select className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark" value={newMeeting.type} onChange={e => setNewMeeting({...newMeeting, type: e.target.value as MeetingType})}>
             <option>Google Meet</option><option>Zoom</option><option>WhatsApp</option><option>Phone</option><option>In-Person</option>
           </select>
           <input type="datetime-local" required className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark" value={newMeeting.startTime} onChange={e => setNewMeeting({...newMeeting, startTime: e.target.value})} />
           <input type="text" placeholder="Link (Optional)" className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark" value={newMeeting.link} onChange={e => setNewMeeting({...newMeeting, link: e.target.value})} />
           <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">Schedule</Button></div>
        </form>
      </Modal>
    </div>
  );
};

// --- TASKS MODULE ---
export const TasksModule: React.FC = () => {
  const { tasks, addTask, toggleTask, removeTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask({ id: Date.now().toString(), title: newTaskTitle, isCompleted: false });
      setNewTaskTitle('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Tasks & To-Do</h2>
      <Card className="p-6">
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
           <input type="text" placeholder="Add a new task..." className="flex-1 px-4 py-2 bg-gray-50 dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
           <Button type="submit"><Plus size={20} /></Button>
        </form>
        <div className="space-y-2">
          {tasks.map(task => (
             <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg group transition-colors ${task.isCompleted ? 'bg-gray-50 dark:bg-white/5 opacity-60' : 'bg-white dark:bg-[#2a2a2a] border border-border-light dark:border-border-dark'}`}>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTask(task.id)}>
                   {task.isCompleted ? <CheckCircle className="text-green-500" size={20} /> : <Circle className="text-gray-400" size={20} />}
                   <span className={task.isCompleted ? 'line-through text-txt-secondary-light dark:text-txt-secondary-dark' : 'text-txt-primary-light dark:text-txt-primary-dark'}>{task.title}</span>
                </div>
                <button onClick={() => removeTask(task.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
             </div>
          ))}
          {tasks.length === 0 && <p className="text-center text-txt-secondary-light dark:text-txt-secondary-dark py-4">No tasks yet. Add one above!</p>}
        </div>
      </Card>
    </div>
  );
};

// --- NOTES MODULE ---
export const NotesModule: React.FC = () => {
  const { notes, addNote, removeNote } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title && newNote.content) {
      addNote({ ...newNote, id: Date.now().toString(), updatedAt: new Date().toISOString() } as Note);
      setIsModalOpen(false);
      setNewNote({ title: '', content: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Notes</h2>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={16} className="mr-2" /> New Note</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <Card key={note.id} className="p-5 flex flex-col h-64 hover:shadow-lg transition-shadow group relative">
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-txt-primary-light dark:text-txt-primary-dark truncate">{note.title}</h3>
                <button onClick={() => removeNote(note.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
             </div>
             <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark mb-4 whitespace-pre-wrap line-clamp-6 flex-1">{note.content}</p>
             <span className="text-xs text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Note">
        <form onSubmit={handleAdd} className="space-y-4">
           <input type="text" placeholder="Title" required className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} />
           <textarea placeholder="Start typing..." required rows={6} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark" value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} />
           <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">Save Note</Button></div>
        </form>
      </Modal>
    </div>
  );
};

// --- FILES MODULE ---
export const FilesModule: React.FC = () => {
  const { files, addFile, removeFile } = useStore();

  const handleUpload = () => {
    const fakeFile: FileItem = {
      id: Date.now().toString(),
      name: `Document_${Math.floor(Math.random() * 100)}.pdf`,
      sizeKB: Math.floor(Math.random() * 5000),
      type: 'PDF',
      url: '#',
      uploadedAt: new Date().toISOString()
    };
    addFile(fakeFile);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Files & Storage</h2>
        <Button onClick={handleUpload}><Upload size={16} className="mr-2" /> Upload File</Button>
      </div>
      <Card>
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Search files..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-sm text-txt-primary-light dark:text-txt-primary-dark outline-none" />
             </div>
             <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">Storage Used: 45MB / 500MB</span>
        </div>
        <div className="divide-y divide-border-light dark:divide-border-dark">
           {files.map(file => (
              <div key={file.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 group">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg"><File size={20} /></div>
                    <div>
                       <p className="font-medium text-sm text-txt-primary-light dark:text-txt-primary-dark">{file.name}</p>
                       <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{file.sizeKB} KB • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-primary-500"><Download size={18} /></button>
                    <button onClick={() => removeFile(file.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                 </div>
              </div>
           ))}
           {files.length === 0 && <div className="p-8 text-center text-gray-400">No files uploaded yet.</div>}
        </div>
      </Card>
    </div>
  );
};
