
import React from 'react';
import { useStore } from '../store';
import { Card, Button, Badge } from '../components/UI';
import { Users, Calendar, MessageSquare, TrendingUp, Clock, ArrowRight, AlertCircle, CheckSquare, Video, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const { clients, bookings, user, tasks, meetings, notes } = useStore();
  const navigate = useNavigate();

  const firstName = user?.name?.split(' ')[0] || 'User';
  const isIndividual = user?.role === 'individual';

  // --- INDIVIDUAL DASHBOARD ---
  if (isIndividual) {
     const pendingTasks = tasks.filter(t => !t.isCompleted);
     const upcomingMeetings = meetings.filter(m => new Date(m.startTime) > new Date()).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
     
     return (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">My Day</h1>
                    <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Welcome, {firstName}! Stay productive today.</p>
                </div>
                <Button onClick={() => navigate('/tasks')}>
                    <CheckSquare className="w-4 h-4 mr-2" /> View Tasks
                </Button>
           </div>

           {/* Productivity Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 flex items-center gap-4">
                 <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20"><CheckSquare size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">{pendingTasks.length}</h3>
                    <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">Tasks Pending</p>
                 </div>
              </Card>
              <Card className="p-6 flex items-center gap-4">
                 <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20"><Video size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">{upcomingMeetings.length}</h3>
                    <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">Upcoming Meetings</p>
                 </div>
              </Card>
              <Card className="p-6 flex items-center gap-4">
                 <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20"><FileText size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">{notes.length}</h3>
                    <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">Total Notes</p>
                 </div>
              </Card>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Task List Preview */}
               <Card className="p-6">
                  <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Priority Tasks</h3>
                  <div className="space-y-3">
                     {pendingTasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                           <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                           <span className="text-txt-primary-light dark:text-txt-primary-dark">{task.title}</span>
                        </div>
                     ))}
                     {pendingTasks.length === 0 && <p className="text-gray-400 text-sm">No pending tasks! Great job.</p>}
                  </div>
               </Card>

               {/* Meeting Preview */}
               <Card className="p-6">
                  <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Next Meeting</h3>
                  {upcomingMeetings.length > 0 ? (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900">
                         <h4 className="font-bold text-lg text-blue-800 dark:text-blue-200">{upcomingMeetings[0].title}</h4>
                         <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300 mt-2">
                            <Clock size={16} /> {new Date(upcomingMeetings[0].startTime).toLocaleString()}
                         </div>
                         {upcomingMeetings[0].link && (
                            <a href={upcomingMeetings[0].link} target="_blank" rel="noreferrer" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Join Now</a>
                         )}
                      </div>
                  ) : (
                      <p className="text-gray-400 text-sm">No upcoming meetings scheduled.</p>
                  )}
               </Card>
           </div>
        </div>
     );
  }

  // --- ARTIST BUSINESS DASHBOARD ---

  // Logic for Today's Schedule
  const today = new Date();
  const todaysBookings = bookings.filter(b => 
    new Date(b.date).toDateString() === today.toDateString()
  ).sort((a, b) => a.time.localeCompare(b.time));

  // Logic for Upcoming (Next 7 days)
  const upcomingBookings = bookings.filter(b => {
    const d = new Date(b.date);
    return d > today && b.status === 'UPCOMING';
  });

  // Mock Bot Leads (In real app, derive from conversations)
  const botLeadsCount = clients.filter(c => c.source === 'Bot').length;
  const recentInquiries = [
    { id: 1, name: 'Priya Sharma', query: 'Wedding makeup price?', time: '10m ago', source: 'Instagram' },
    { id: 2, name: 'Anjali Desai', query: 'Available on Dec 12?', time: '1h ago', source: 'Website' },
    { id: 3, name: 'Rahul Verma', query: 'Do you do groom styling?', time: '3h ago', source: 'Website' },
  ];

  const stats = [
    { 
      label: 'Total Clients', 
      value: clients.length, 
      icon: Users, 
      color: 'bg-blue-500',
      subtext: 'Lifetime database'
    },
    { 
      label: 'Upcoming Jobs', 
      value: upcomingBookings.length, 
      icon: Calendar, 
      color: 'bg-purple-500',
      subtext: 'Next 7 days'
    },
    { 
      label: 'AI Bot Leads', 
      value: botLeadsCount, 
      icon: MessageSquare, 
      color: 'bg-green-500',
      subtext: 'Generated automatically'
    },
    { 
      label: 'Today\'s Schedule', 
      value: todaysBookings.length, 
      icon: Clock, 
      color: 'bg-orange-500',
      subtext: 'Appointments today'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Business Overview</h1>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Welcome back {firstName}! Here is what's happening today.</p>
        </div>
        <Button onClick={() => navigate('/bookings')}>
           <Calendar className="w-4 h-4 mr-2" /> View Calendar
        </Button>
      </div>
      
      {/* 1. Quick Business Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-start justify-between hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-primary-500">
            <div>
              <p className="text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">{stat.label}</p>
              <h2 className="text-3xl font-bold text-txt-primary-light dark:text-txt-primary-dark">{stat.value}</h2>
              <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-2">{stat.subtext}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-opacity-20`}>
              <stat.icon size={24} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Today's Schedule */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
               <Clock className="text-primary-500" size={20} /> Today's Schedule
             </h3>
             <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">{today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          
          <div className="space-y-4">
            {todaysBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-txt-secondary-light dark:text-txt-secondary-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-xl">
                <Calendar size={40} className="mb-2 opacity-50" />
                <p>No appointments scheduled for today.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/bookings')}>Add Booking</Button>
              </div>
            ) : (
              todaysBookings.map(booking => (
                <div key={booking.id} className="flex items-center gap-4 p-4 border border-border-light dark:border-border-dark rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400 font-bold">
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">{booking.clientName}</h4>
                    <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">{booking.notes || 'Service Appointment'}</p>
                  </div>
                  <div className="text-right">
                    <Badge color="blue">{booking.status}</Badge>
                    <div className="mt-2">
                       <Button size="sm" variant="secondary" onClick={() => navigate('/bookings')}>Details</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* 3. Recent Inquiries (Bot Inbox) */}
        <Card className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
               <MessageSquare className="text-green-500" size={20} /> Recent Inquiries
             </h3>
             <Button variant="secondary" size="sm" onClick={() => navigate('/bot')}>View All</Button>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-transparent hover:border-border-light dark:hover:border-border-dark transition-colors cursor-pointer" onClick={() => navigate('/bot')}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-txt-primary-light dark:text-txt-primary-dark">{inquiry.name}</span>
                  <span className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark">{inquiry.time}</span>
                </div>
                <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark line-clamp-1 mb-2">"{inquiry.query}"</p>
                <div className="flex justify-between items-center">
                   <Badge color="purple">New Lead</Badge>
                   <span className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark">{inquiry.source}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
               <AlertCircle size={16} />
               <span className="flex-1">You have 3 unread leads from the AI Bot.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Recent Clients & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg text-txt-primary-light dark:text-txt-primary-dark">Recent Clients</h3>
               <Button variant="outline" size="sm" onClick={() => navigate('/crm')}>Manage CRM</Button>
            </div>
            <div className="space-y-3">
              {clients.slice(0, 3).map(client => (
                <div key={client.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  <img src={client.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark">{client.name}</p>
                    <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{client.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${
                    client.status === 'BOOKED' 
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900' 
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900'
                  }`}>
                    {client.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none">
             <h3 className="font-bold text-xl mb-2">Grow Your Business</h3>
             <p className="text-primary-100 mb-6 text-sm">Unlock premium features to automate your workflow and get more bookings.</p>
             <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                   <div className="p-1 bg-white/20 rounded"><TrendingUp size={14} /></div>
                   <span>AI Smart Follow-ups</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                   <div className="p-1 bg-white/20 rounded"><Clock size={14} /></div>
                   <span>Automated Reminders</span>
                </div>
             </div>
             <Button onClick={() => navigate('/addons')} className="bg-white text-primary-700 hover:bg-gray-100 border-none w-full">
                Explore Add-ons Market <ArrowRight size={16} className="ml-2" />
             </Button>
          </Card>
      </div>
    </div>
  );
};
