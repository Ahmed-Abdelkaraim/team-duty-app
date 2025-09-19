import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamType, User } from '@/types/attendance';
import { getBranches } from '@/utils/csvParser';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [team, setTeam] = useState<TeamType | ''>('');
  const [branch, setBranch] = useState('');
  
  const branches = getBranches();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !code || !team) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (team === 'نقل' && !branch) {
      alert('يرجى اختيار الفرع');
      return;
    }
    
    onLogin({
      name,
      code,
      team: team as TeamType,
      branch: team === 'نقل' ? branch : undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card border-none shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">نظام إدارة الحضور</CardTitle>
          <CardDescription className="text-muted-foreground">
            سجل دخولك للوصول إلى النظام
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
                className="text-right"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">الكود</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="أدخل الكود الخاص بك"
                className="text-right"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">الفريق</Label>
              <Select value={team} onValueChange={(value: TeamType) => setTeam(value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الفريق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقل">فريق النقل</SelectItem>
                  <SelectItem value="تنظيم خارجي">فريق التنظيم الخارجي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {team === 'نقل' && (
              <div className="space-y-2">
                <Label htmlFor="branch">الفرع</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branchOption) => (
                      <SelectItem key={branchOption} value={branchOption}>
                        {branchOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              دخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}