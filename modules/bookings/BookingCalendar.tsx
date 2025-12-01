
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Card, Button, Modal, Badge } from '../../components/UI';
import { ChevronLeft, ChevronRight, Plus, Clock, AlertCircle, Bell, Trash2, Edit, CheckCircle, XCircle, MapPin, Briefcase } from 'lucide-react';
import { Booking, BookingStatus } from '../../types';
import clsx from 'clsx';

export const BookingCalendar: React.FC = () => {
  const { bookings, addBooking, updateBooking, clients, services } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Booking>>({
    clientId: '',
    time: '09:00',
    venue: '',
    notes: ''
  });

  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  // Check for double booking
  const isSlotOccupied = (date: Date, time: string, excludeId?: string) => {
    const dateStr = date.toDateString();
    return bookings.some(b => 
      b.id !== excludeId &&
      b.status !== BookingStatus.CANCELLED &&
      new Date(b.date).toDateString() === dateStr &&
      b.time === time
    );
  };

  // Open Add Modal
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setFormData({ clientId: '', time: '09:00', venue: '', notes: '' });
    setErrorMsg(null);
    setIsAddModalOpen(true);
  };

  // Open Edit/View Modal
  const handleBookingClick = (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    setSelectedDate(new Date(booking.date));
    setEditingBookingId(booking.id);
    setFormData({
      clientId: booking.clientId,
      time: booking.time,
      venue: booking.venue || '',
      notes: booking.notes || '',
      status: booking.status
    });
    setErrorMsg(null);
    setIsEditModalOpen(true);
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !formData.clientId) return;

    if (isSlotOccupied(selectedDate, formData.time!)) {
      setErrorMsg("This time slot is already booked! Please choose another time.");
      return;
    }

    const client = clients.find(c => c.id === formData.clientId);
    
    addBooking({
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate.toISOString(),
      status: BookingStatus.UPCOMING,
      clientName: client?.name || 'Unknown',
      clientId: formData.clientId,
      time: formData.time!,
      venue: formData.venue,
      notes: formData.notes
    });
    
    setIsAddModalOpen(false);
  };

  const handleUpdateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookingId || !selectedDate) return;

    // If not cancelled, check for double booking (exclude self)
    if (formData.status !== BookingStatus.CANCELLED && isSlotOccupied(selectedDate, formData.time!, editingBookingId)) {
       setErrorMsg("This time slot is already booked! Please choose another time.");
       return;
    }

    const client = clients.find(c => c.id === formData.clientId);

    updateBooking(editingBookingId, {
        ...formData,
        clientName: client?.name || 'Unknown',
        date: selectedDate.toISOString() // In case date logic is added later, ensuring consistency
    });

    setIsEditModalOpen(false);
  };

  const handleCancelBooking = () => {
    if (editingBookingId) {
        if(confirm("Are you sure you want to cancel this booking?")) {
            updateBooking(editingBookingId, { status: BookingStatus.CANCELLED });
            setIsEditModalOpen(false);
        }
    }
  };

  const handleSendReminder = () => {
      alert("Reminder sent to client via WhatsApp and Email!");
  };

  const handleServiceChange = (serviceId: string) => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
          const noteText = `Service: ${service.name} (${service.price})`;
          setFormData(prev => ({
              ...prev,
              notes: prev.notes ? `${prev.notes}\n${noteText}` : noteText
          }));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Bookings</h1>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Manage appointments, check availability, and send reminders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="px-4 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg font-medium min-w-[150px] text-center text-txt-primary-light dark:text-txt-primary-dark">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="secondary" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2 p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-7 gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="h-24 bg-gray-50/30 dark:bg-white/5 rounded-lg" />;
                  
                  const dayBookings = bookings.filter(b => 
                    new Date(b.date).toDateString() === day.toDateString()
                  );

                  return (
                    <div 
                      key={day.toISOString()} 
                      onClick={() => handleDayClick(day)}
                      className="h-24 border border-gray-100 dark:border-border-dark rounded-lg p-2 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-[#2a2a2a] flex flex-col"
                    >
                      <span className={clsx(
                        "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                        day.toDateString() === new Date().toDateString() ? "bg-primary-500 text-white" : "text-txt-primary-light dark:text-txt-primary-dark"
                      )}>
                        {day.getDate()}
                      </span>
                      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
                        {dayBookings.map(b => (
                          <div 
                            key={b.id} 
                            onClick={(e) => handleBookingClick(e, b)}
                            className={clsx(
                                "text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80",
                                b.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 line-through' :
                                b.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                                'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            )}
                          >
                            {b.time} {b.clientName}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming List Side Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Upcoming</h3>
            <div className="space-y-4">
              {bookings.filter(b => b.status === 'UPCOMING').length === 0 && <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm">No upcoming bookings.</p>}
              {bookings.filter(b => b.status === 'UPCOMING').slice(0, 4).map(booking => (
                <div key={booking.id} className="flex gap-4 items-start pb-4 border-b border-border-light dark:border-border-dark last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">{new Date(booking.date).getDate()}</span>
                    <span className="text-[10px] uppercase">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 cursor-pointer" onClick={(e) => handleBookingClick(e, booking)}>
                    <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark hover:text-primary-500 transition-colors">{booking.clientName}</p>
                    <div className="flex items-center gap-2 text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                      <Clock className="w-3 h-3" /> {booking.time}
                    </div>
                    {booking.venue && (
                        <div className="flex items-center gap-2 text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                            <MapPin className="w-3 h-3" /> <span className="truncate">{booking.venue}</span>
                        </div>
                    )}
                    {booking.notes && <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-1 line-clamp-1">{booking.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => alert("Filter functionality coming soon!")}>View All List</Button>
          </Card>
        </div>
      </div>

      {/* ADD BOOKING MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Booking">
        <form onSubmit={handleAddBooking} className="space-y-4 text-txt-primary-light dark:text-txt-primary-dark">
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            Scheduling for: <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark">{selectedDate?.toDateString()}</span>
          </p>
          
          {errorMsg && (
             <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {errorMsg}
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Client</label>
            <select 
              required
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.clientId}
              onChange={e => setFormData({...formData, clientId: e.target.value})}
            >
              <option value="">Select a Client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Time</label>
            <input 
              type="time" 
              required
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>

           {/* Service Selector */}
           <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Service (Optional)</label>
            <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-4 h-4" />
                <select 
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                    onChange={(e) => handleServiceChange(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Select a Service</option>
                    {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} - {s.price}</option>
                    ))}
                </select>
            </div>
            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-1">Selecting a service adds it to notes.</p>
          </div>

          {/* VENUE FIELD */}
          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Venue / Location</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-4 h-4" />
                <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                value={formData.venue || ''}
                onChange={e => setFormData({...formData, venue: e.target.value})}
                placeholder="e.g. Grand Hall, Studio, Client Home"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Notes</label>
            <textarea 
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Booking</Button>
          </div>
        </form>
      </Modal>

      {/* EDIT / MANAGE BOOKING MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Manage Booking">
        <form onSubmit={handleUpdateBooking} className="space-y-4 text-txt-primary-light dark:text-txt-primary-dark">
          <div className="flex justify-between items-center pb-2 border-b border-border-light dark:border-border-dark mb-4">
             <div>
                <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Booking ID: #{editingBookingId?.slice(0,6)}</p>
                <p className="font-medium">{selectedDate?.toDateString()}</p>
             </div>
             <Badge color={formData.status === 'CANCELLED' ? 'red' : formData.status === 'COMPLETED' ? 'gray' : 'green'}>
                 {formData.status}
             </Badge>
          </div>

          {errorMsg && (
             <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {errorMsg}
             </div>
          )}

          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Client</label>
            <select 
              disabled
              className="w-full px-3 py-2 bg-gray-100 dark:bg-[#222] border border-border-light dark:border-border-dark rounded-lg outline-none cursor-not-allowed opacity-70"
              value={formData.clientId}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Time (Move)</label>
                <input 
                type="time" 
                required
                disabled={formData.status === 'CANCELLED'}
                className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none disabled:opacity-50"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Status</label>
                <select 
                    className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
             </div>
          </div>

          {/* EDIT VENUE FIELD */}
          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Venue / Location</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-4 h-4" />
                <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
                value={formData.venue || ''}
                onChange={e => setFormData({...formData, venue: e.target.value})}
                placeholder="e.g. Grand Hall, Studio, Client Home"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Notes</label>
            <textarea 
              className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
             <Button type="button" variant="outline" size="sm" onClick={handleSendReminder} disabled={formData.status === 'CANCELLED'}>
                 <Bell className="w-4 h-4 mr-2" /> Send Reminder
             </Button>
             {formData.status !== 'CANCELLED' && (
                <Button type="button" variant="danger" size="sm" onClick={handleCancelBooking}>
                    <XCircle className="w-4 h-4 mr-2" /> Cancel Booking
                </Button>
             )}
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark mt-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Close</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
