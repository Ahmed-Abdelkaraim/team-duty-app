import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Bus, MapPin } from 'lucide-react';
import { User, AttendanceMember } from '@/types/attendance';
import { getMembersByBranch } from '@/utils/csvParser';
import { useToast } from '@/components/ui/use-toast';

interface TransportDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function TransportDashboard({ user, onLogout }: TransportDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState(() => getMembersByBranch(user.branch!));
  const [busArrival, setBusArrival] = useState('');
  const [busDeparture, setBusDeparture] = useState('');
  const [eventArrival, setEventArrival] = useState('');
  const { toast } = useToast();

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.name.includes(searchTerm) || 
      member.code.includes(searchTerm)
    );
  }, [members, searchTerm]);

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

  const handleBusTimeSubmit = () => {
    if (!busArrival || !busDeparture || !eventArrival) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى ملء جميع أوقات الباص",
      });
      return;
    }
    
    toast({
      title: "تم حفظ أوقات الباص",
      description: "تم حفظ مواعيد الباص بنجاح",
    });
  };

  const attendedCount = members.filter(m => m.status === 'حضور').length;
  const absentCount = members.filter(m => m.status === 'غياب').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-primary text-white border-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">مرحباً {user.name}</CardTitle>
                <p className="opacity-90">فريق النقل - فرع {user.branch}</p>
              </div>
              <Button variant="outline" onClick={onLogout} className="text-primary bg-white hover:bg-gray-100">
                تسجيل خروج
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{attendedCount}</div>
              <p className="text-muted-foreground">حضور</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{absentCount}</div>
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
          {/* Attendance Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                إدارة الحضور - فرع {user.branch}
              </CardTitle>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالاسم أو الكود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMembers.map((member) => (
                <div
                  key={member.code}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="text-right flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">كود: {member.code}</p>
                  </div>
                  <Button
                    onClick={() => handleAttendanceToggle(member.code)}
                    variant={member.status === 'حضور' ? 'default' : 'destructive'}
                    size="sm"
                    className={member.status === 'حضور' ? 'bg-success hover:bg-success/90' : ''}
                  >
                    {member.status}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bus Time Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                إدارة مواعيد الباص
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="busArrival" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  وقت وصول الباص
                </Label>
                <Input
                  id="busArrival"
                  type="time"
                  value={busArrival}
                  onChange={(e) => setBusArrival(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="busDeparture" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  وقت تحرك الباص
                </Label>
                <Input
                  id="busDeparture"
                  type="time"
                  value={busDeparture}
                  onChange={(e) => setBusDeparture(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventArrival" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  وقت الوصول للحفلة
                </Label>
                <Input
                  id="eventArrival"
                  type="time"
                  value={eventArrival}
                  onChange={(e) => setEventArrival(e.target.value)}
                />
              </div>
              
              <Button onClick={handleBusTimeSubmit} className="w-full bg-primary hover:bg-primary/90">
                حفظ مواعيد الباص
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}