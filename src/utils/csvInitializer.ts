import { supabase } from '@/integrations/supabase/client';
import { getMembersByBranch, getBranches } from './csvParser';

export const initializeAttendanceData = async () => {
  try {
    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('attendance_records')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return false;
    }

    // If data already exists, don't initialize again
    if (existingData && existingData.length > 0) {
      console.log('Attendance data already initialized');
      return true;
    }

    // Get all branches and their members
    const branches = getBranches();
    const allMembers = [];

    for (const branch of branches) {
      const branchMembers = getMembersByBranch(branch);
      allMembers.push(...branchMembers);
    }

    // Insert all members into the database
    const attendanceRecords = allMembers.map(member => ({
      member_code: member.code,
      member_name: member.name,
      branch: member.branch,
      category: member.category,
      status: member.status,
      updated_by: 'System',
      updated_by_team: 'Initial Load'
    }));

    const { error: insertError } = await supabase
      .from('attendance_records')
      .insert(attendanceRecords);

    if (insertError) {
      console.error('Error inserting attendance data:', insertError);
      return false;
    }

    console.log('Attendance data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing attendance data:', error);
    return false;
  }
};