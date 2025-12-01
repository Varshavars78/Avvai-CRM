
import { supabase } from './supabaseClient';
import { Client, Booking, Meeting, Task, Note, UserProfile, FeatureFlags } from '../types';

// --- 1. AUTH & ROLE LOGIC ---

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getProfile(user.id);
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, plans(*)')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  
  // Merge Plan Features with Custom Admin Overrides
  const planFeatures = data.plans?.features || {};
  const customFeatures = data.custom_features || {};
  const finalFeatures = { ...planFeatures, ...customFeatures };

  return {
    ...data,
    features: finalFeatures
  };
};

// --- 2. SHARED MODULES (Artist & Individual) ---

// MEETINGS
export const fetchMeetings = async (userId: string) => {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data;
};

export const createMeeting = async (meeting: Partial<Meeting>, userId: string) => {
  const { data, error } = await supabase
    .from('meetings')
    .insert([{ ...meeting, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// TASKS
export const fetchTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const toggleTask = async (taskId: string, isCompleted: boolean) => {
  const { error } = await supabase
    .from('tasks')
    .update({ status: isCompleted ? 'completed' : 'pending' })
    .eq('id', taskId);
  if (error) throw error;
};

// --- 3. ARTIST ONLY MODULES ---

export const fetchClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addClient = async (client: Partial<Client>, artistId: string) => {
  // Business Logic: Check Plan Limits could go here via Edge Function
  const { data, error } = await supabase
    .from('clients')
    .insert([{ ...client, artist_id: artistId }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const createBooking = async (booking: Partial<Booking>, artistId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      artist_id: artistId,
      client_id: booking.clientId,
      client_name: booking.clientName,
      date: booking.date,
      time: booking.time,
      venue: booking.venue,
      notes: booking.notes,
      status: 'UPCOMING'
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// --- 4. ADMIN LOGIC ---

export const fetchAllUsers = async () => {
  // Only Admin can run this due to RLS
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
};

export const updateUserPlan = async (userId: string, planId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ plan_id: planId })
    .eq('id', userId);
  if (error) throw error;
};

export const toggleUserFeature = async (userId: string, featureKey: string, isEnabled: boolean) => {
  // Fetch current overrides
  const { data } = await supabase.from('profiles').select('custom_features').eq('id', userId).single();
  const currentFeatures = data?.custom_features || {};
  
  // Update
  const { error } = await supabase
    .from('profiles')
    .update({ 
      custom_features: { ...currentFeatures, [featureKey]: isEnabled } 
    })
    .eq('id', userId);
    
  if (error) throw error;
};
