import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX } from 'lucide-react';
import { User, AttendanceMember } from '@/types/attendance';
import { getBranches, getMembersByBranch } from '@/utils/csvParser';
import { useToast } from '@/components/ui/use-toast';

interface ExternalDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function ExternalDashboard({ user, onLogout }: ExternalDashboardProps) {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [members, setMembers] = useState<AttendanceMember[]>([]);
  const { toast } = useToast();
  
  const branches = getBranches();

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    const branchMembers = getMembersByBranch(branch);
    setMembers(branchMembers);
  };

  const handleAttendanceToggle = (memberCode: string) => {
    setMembers(prev => prev.map(member => 
      member.code === memberCode 
        ? { ...member, status: member.status === 'حضور' ? 'غياب' : 'حضور' }
        : member
    ));
    
    toast({
      title: "تم تحديث الحضور",
      description: "تم تحديث حالة الحضور بنجاح",
    });
  };

  const attendedMembers = members.filter(m => m.status === 'حضور');
  const absentMembers = members.filter(m => m.status === 'غياب');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">مرحباً {user.name}</CardTitle>
                <p className="opacity-90">فريق التنظيم الخارجي</p>
              </div>
              <Button variant="outline" onClick={onLogout} className="text-primary bg-white hover:bg-gray-100">
                تسجيل خروج
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Branch Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              اختيار الفرع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر الفرع للمراجعة" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedBranch && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{attendedMembers.length}</div>
                  <p className="text-muted-foreground">حضور</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">{absentMembers.length}</div>
                  <p className="text-muted-foreground">غياب</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{members.length}</div>
                  <p className="text-muted-foreground">إجمالي الأعضاء</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attended Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <UserCheck className="h-5 w-5" />
                    الأعضاء الحاضرون - {selectedBranch}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {attendedMembers.map((member) => (
                    <div
                      key={member.code}
                      className="flex items-center justify-between p-3 rounded-lg border bg-success/5 hover:shadow-md transition-shadow"
                    >
                      <div className="text-right flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">كود: {member.code}</p>
                        <Badge variant="secondary" className="mt-1">{member.category}</Badge>
                      </div>
                      <Button
                        onClick={() => handleAttendanceToggle(member.code)}
                        variant="destructive"
                        size="sm"
                      >
                        تسجيل غياب
                      </Button>
                    </div>
                  ))}
                  {attendedMembers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">لا يوجد أعضاء حاضرون</p>
                  )}
                </CardContent>
              </Card>

              {/* Absent Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <UserX className="h-5 w-5" />
                    الأعضاء الغائبون - {selectedBranch}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {absentMembers.map((member) => (
                    <div
                      key={member.code}
                      className="flex items-center justify-between p-3 rounded-lg border bg-destructive/5 hover:shadow-md transition-shadow"
                    >
                      <div className="text-right flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">كود: {member.code}</p>
                        <Badge variant="secondary" className="mt-1">{member.category}</Badge>
                      </div>
                      <Button
                        onClick={() => handleAttendanceToggle(member.code)}
                        className="bg-success hover:bg-success/90"
                        size="sm"
                      >
                        تسجيل حضور
                      </Button>
                    </div>
                  ))}
                  {absentMembers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">لا يوجد أعضاء غائبون</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}