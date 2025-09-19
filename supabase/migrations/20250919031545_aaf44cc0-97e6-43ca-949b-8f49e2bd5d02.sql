-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_code TEXT NOT NULL,
  member_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'غياب' CHECK (status IN ('حضور', 'غياب')),
  updated_by TEXT,
  updated_by_team TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(member_code)
);

-- Create bus times table
CREATE TABLE public.bus_times (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch TEXT NOT NULL,
  arrival_time TIME,
  departure_time TIME,
  event_arrival_time TIME,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(branch)
);

-- Enable Row Level Security
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_times ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance_records (allow all operations for now)
CREATE POLICY "Anyone can view attendance records" 
ON public.attendance_records 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert attendance records" 
ON public.attendance_records 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update attendance records" 
ON public.attendance_records 
FOR UPDATE 
USING (true);

-- Create policies for bus_times
CREATE POLICY "Anyone can view bus times" 
ON public.bus_times 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert bus times" 
ON public.bus_times 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update bus times" 
ON public.bus_times 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bus_times_updated_at
  BEFORE UPDATE ON public.bus_times
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for both tables
ALTER publication supabase_realtime ADD TABLE public.attendance_records;
ALTER publication supabase_realtime ADD TABLE public.bus_times;

-- Set replica identity to full for realtime updates
ALTER TABLE public.attendance_records REPLICA IDENTITY FULL;
ALTER TABLE public.bus_times REPLICA IDENTITY FULL;