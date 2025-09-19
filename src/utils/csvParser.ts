import { AttendanceMember } from '@/types/attendance';
import csvData from '@/data/attendance.csv?raw';

export function parseAttendanceData(): AttendanceMember[] {
  const lines = csvData.trim().split('\n');
  const data: AttendanceMember[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const [name, branch, category, status, code] = lines[i].split(',');
    
    if (name && branch && category && status && code) {
      data.push({
        name: name.trim(),
        branch: branch.trim(),
        category: category.trim(),
        status: status.trim() as 'حضور' | 'غياب',
        code: code.trim()
      });
    }
  }
  
  return data;
}

export function getBranches(): string[] {
  const data = parseAttendanceData();
  const branches = [...new Set(data.map(member => member.branch))];
  return branches.sort();
}

export function getMembersByBranch(branch: string): AttendanceMember[] {
  const data = parseAttendanceData();
  return data.filter(member => member.branch === branch);
}