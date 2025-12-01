
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Card, Button, Badge } from '../../components/UI';
import { Search, Eye, Power, CheckCircle, AlertTriangle, XCircle, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VerificationStatus } from '../../types';

export const AdminArtists: React.FC = () => {
  const { artists, updateArtistStatus } = useStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredArtists = artists.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    updateArtistStatus(id, newStatus);
  };

  const getVerificationIcon = (status: VerificationStatus) => {
    switch(status) {
      case 'Verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Artists Management</h1>
        <Button onClick={() => navigate('/admin/users/add')}>
            <UserPlus className="w-4 h-4 mr-2" /> Add Artist
        </Button>
      </div>

      <Card>
        {/* Search */}
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-txt-primary-light dark:text-txt-primary-dark"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-white/5 text-txt-secondary-light dark:text-txt-secondary-dark">
              <tr>
                <th className="px-6 py-3 font-medium">Artist Name</th>
                <th className="px-6 py-3 font-medium">Verification</th>
                <th className="px-6 py-3 font-medium">Current Plan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark text-txt-primary-light dark:text-txt-primary-dark">
              {filteredArtists.map((artist) => (
                <tr key={artist.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{artist.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {getVerificationIcon(artist.verificationStatus)}
                        <span>{artist.verificationStatus}</span>
                    </div>
                  </td>
                   <td className="px-6 py-4">
                     <Badge color="blue">{artist.plan}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={artist.status === 'Active' ? 'green' : 'red'}>{artist.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-txt-secondary-light dark:text-txt-secondary-dark">{artist.joinedDate}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => navigate(`/admin/artists/${artist.id}`)}
                    >
                      <Eye size={14} className="mr-1" /> Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant={artist.status === 'Active' ? 'danger' : 'primary'}
                      onClick={() => toggleStatus(artist.id, artist.status)}
                    >
                      <Power size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
