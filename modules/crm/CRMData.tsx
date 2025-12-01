
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Card, Button, Badge, Modal } from '../../components/UI';
import { Plus, Search, MoreVertical, Phone, Mail, Edit, Trash2, LayoutGrid, List, MapPin, FileText } from 'lucide-react';
import { Client, ClientStatus } from '../../types';
import clsx from 'clsx';

export const CRMData: React.FC = () => {
  const { clients, addClient, updateClient, removeClient } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Client Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    status: ClientStatus.LEAD,
    source: 'Manual',
    description: '',
    venue: ''
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      status: ClientStatus.LEAD, 
      source: 'Manual',
      description: '',
      venue: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData({ ...client });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      removeClient(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      updateClient(editingId, formData);
    } else {
      addClient({
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 100)}`,
        ...formData as Client
      });
    }
    setIsModalOpen(false);
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, clientId: string) => {
    e.dataTransfer.setData('clientId', clientId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow Drop
  };

  const handleDrop = (e: React.DragEvent, newStatus: ClientStatus) => {
    const clientId = e.dataTransfer.getData('clientId');
    if (clientId) {
      updateClient(clientId, { status: newStatus });
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesFilter = filter === 'ALL' || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: ClientStatus) => {
    switch(status) {
      case ClientStatus.BOOKED: return 'green';
      case ClientStatus.COMPLETED: return 'blue';
      default: return 'yellow';
    }
  };

  const renderKanbanColumn = (status: ClientStatus, title: string) => {
    const columnClients = filteredClients.filter(c => c.status === status);

    return (
      <div 
        className="flex-1 min-w-[280px] bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-border-light dark:border-border-dark flex flex-col"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
             {title}
             <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">{columnClients.length}</span>
           </h3>
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto min-h-[100px]">
           {columnClients.map(client => (
             <div 
               key={client.id}
               draggable
               onDragStart={(e) => handleDragStart(e, client.id)}
               className="bg-white dark:bg-card-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark cursor-move hover:shadow-md transition-shadow"
             >
               <div className="flex items-center gap-3 mb-2">
                 <img src={client.avatar} className="w-8 h-8 rounded-full" />
                 <div>
                   <p className="font-medium text-sm text-txt-primary-light dark:text-txt-primary-dark">{client.name}</p>
                   <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">#{client.id.slice(0,4)}</p>
                 </div>
               </div>
               <div className="space-y-1 mb-2">
                 {client.venue && (
                   <div className="flex items-center gap-1 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                      <MapPin size={12} /> <span className="truncate">{client.venue}</span>
                   </div>
                 )}
                 {client.description && (
                   <div className="flex items-center gap-1 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                      <FileText size={12} /> <span className="truncate">Has notes</span>
                   </div>
                 )}
               </div>
               <div className="flex justify-between items-center">
                 <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    client.source === 'Bot' 
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-900' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}>
                    {client.source}
                 </span>
                 <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(client)} className="p-1 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-primary-500">
                       <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="p-1 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-red-500">
                       <Trash2 size={14} />
                    </button>
                 </div>
               </div>
             </div>
           ))}
           {columnClients.length === 0 && (
             <div className="h-full flex items-center justify-center text-xs text-txt-secondary-light dark:text-txt-secondary-dark opacity-50">
               Drop here
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Clients</h1>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Manage your leads and customer relationships</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-card-light dark:bg-card-dark p-1 rounded-lg border border-border-light dark:border-border-dark">
              <button 
                onClick={() => setViewMode('list')} 
                className={clsx("p-2 rounded transition-colors", viewMode === 'list' ? "bg-primary-500 text-white" : "text-txt-secondary-light hover:bg-gray-100 dark:hover:bg-white/5")}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('board')} 
                className={clsx("p-2 rounded transition-colors", viewMode === 'board' ? "bg-primary-500 text-white" : "text-txt-secondary-light hover:bg-gray-100 dark:hover:bg-white/5")}
              >
                <LayoutGrid size={18} />
              </button>
           </div>
           <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="shrink-0">
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'LEAD', 'BOOKED', 'COMPLETED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  filter === f 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800' 
                    : 'text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase().replace('ll', 'll')}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark outline-none"
            />
          </div>
        </div>
      </Card>

      {viewMode === 'list' ? (
        <Card className="overflow-hidden flex-1 min-h-0">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-white/5 text-txt-secondary-light dark:text-txt-secondary-dark sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Contact</th>
                  <th className="px-6 py-3 font-medium hidden lg:table-cell">Details</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium hidden sm:table-cell">Source</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark overflow-y-auto">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-txt-primary-light dark:text-txt-primary-dark group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={client.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">ID: #{client.id.slice(0,4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark">
                          <Mail className="w-3 h-3" /> {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark">
                          <Phone className="w-3 h-3" /> {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="space-y-1">
                        {client.venue ? (
                          <div className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark" title={client.venue}>
                            <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate max-w-[150px]">{client.venue}</span>
                          </div>
                        ) : (
                           <span className="text-xs text-gray-400 block">-</span>
                        )}
                        {client.description && (
                          <div className="flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark" title={client.description}>
                            <FileText className="w-3 h-3 shrink-0" /> <span className="truncate max-w-[150px] text-xs">View Notes</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={getStatusColor(client.status)}>{client.status}</Badge>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${
                        client.source === 'Bot' 
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-900' 
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}>
                        {client.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(client)}>
                             <Edit size={14} />
                         </Button>
                         <Button size="sm" variant="danger" onClick={() => handleDelete(client.id)}>
                             <Trash2 size={14} />
                         </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-txt-secondary-light dark:text-txt-secondary-dark">
                      No clients found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 flex-1">
           {renderKanbanColumn(ClientStatus.LEAD, 'Leads')}
           {renderKanbanColumn(ClientStatus.BOOKED, 'Booked Clients')}
           {renderKanbanColumn(ClientStatus.COMPLETED, 'Completed')}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Client" : "Add New Client"}>
        <form onSubmit={handleSubmit} className="space-y-4 text-txt-primary-light dark:text-txt-primary-dark">
          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Email</label>
            <input 
              required
              type="email" 
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Phone</label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as ClientStatus})}
            >
              <option value={ClientStatus.LEAD}>Lead</option>
              <option value={ClientStatus.BOOKED}>Booked</option>
              <option value={ClientStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          {/* NEW DETAILS SECTION */}
          <div className="pt-2 border-t border-border-light dark:border-border-dark mt-4">
            <h4 className="text-sm font-bold text-txt-primary-light dark:text-txt-primary-dark mb-3">Details</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Client Description</label>
                <textarea 
                  className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                  rows={2}
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Requirements, preferences, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Venue Details</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-4 h-4" />
                    <input 
                    type="text" 
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                    value={formData.venue || ''}
                    onChange={e => setFormData({...formData, venue: e.target.value})}
                    placeholder="Location, Hall Name, etc."
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update Client' : 'Save Client'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
