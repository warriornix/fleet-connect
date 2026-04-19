-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'driver');
CREATE TYPE public.vehicle_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'RETIRED');
CREATE TYPE public.fuel_type AS ENUM ('REGULAR', 'MIDGRADE', 'PREMIUM', 'DIESEL', 'ELECTRIC');
CREATE TYPE public.maintenance_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE public.schedule_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');
CREATE TYPE public.priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE public.recall_status AS ENUM ('OPEN', 'INSPECTED', 'REPAIRED', 'CLOSED');
CREATE TYPE public.certificate_type AS ENUM ('REGISTRATION', 'INSURANCE', 'EMISSION', 'INSPECTION', 'MAINTENANCE', 'OWNERSHIP');

-- Updated-at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: user is admin or manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','manager')
  )
$$;

-- Vehicles
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vin TEXT NOT NULL UNIQUE,
  license_plate TEXT NOT NULL UNIQUE,
  color TEXT,
  mileage INTEGER NOT NULL DEFAULT 0,
  status public.vehicle_status NOT NULL DEFAULT 'ACTIVE',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Fuel logs
CREATE TABLE public.fuel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  gallons NUMERIC NOT NULL,
  cost NUMERIC NOT NULL,
  mileage INTEGER NOT NULL,
  odometer INTEGER NOT NULL,
  fuel_type public.fuel_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;

-- Maintenance
CREATE TABLE public.maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  provider TEXT,
  status public.maintenance_status NOT NULL DEFAULT 'SCHEDULED',
  next_due_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;

-- Schedules
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  status public.schedule_status NOT NULL DEFAULT 'PENDING',
  priority public.priority NOT NULL DEFAULT 'MEDIUM',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Recalls
CREATE TABLE public.recalls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recall_id TEXT NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.recall_status NOT NULL DEFAULT 'OPEN',
  remedy TEXT,
  manufacturer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recalls ENABLE ROW LEVEL SECURITY;

-- Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.certificate_type NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date TIMESTAMPTZ,
  document_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  blockchain_tx TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_roles
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- vehicles
CREATE POLICY "view vehicles" ON public.vehicles
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid()) OR auth.uid() = user_id
  );
CREATE POLICY "manage vehicles" ON public.vehicles
  FOR ALL USING (public.is_admin_or_manager(auth.uid()))
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- fuel_logs
CREATE POLICY "view fuel_logs" ON public.fuel_logs
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
    OR EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
CREATE POLICY "insert fuel_logs" ON public.fuel_logs
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND (
      public.is_admin_or_manager(auth.uid())
      OR EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
    )
  );
CREATE POLICY "manage fuel_logs" ON public.fuel_logs
  FOR ALL USING (public.is_admin_or_manager(auth.uid()))
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- maintenance
CREATE POLICY "view maintenance" ON public.maintenance
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
    OR EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
CREATE POLICY "manage maintenance" ON public.maintenance
  FOR ALL USING (public.is_admin_or_manager(auth.uid()))
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- schedules
CREATE POLICY "view schedules" ON public.schedules
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
    OR auth.uid() = assigned_to
    OR EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
CREATE POLICY "manage schedules" ON public.schedules
  FOR ALL USING (public.is_admin_or_manager(auth.uid()))
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- recalls
CREATE POLICY "view recalls" ON public.recalls
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
    OR EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
CREATE POLICY "manage recalls" ON public.recalls
  FOR ALL USING (public.is_admin_or_manager(auth.uid()))
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- certificates
CREATE POLICY "view certificates" ON public.certificates
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
    OR EXISTS (SELECT 1 FROM public.vehicles v WHERE v.id = vehicle_id AND v.user_id = auth.uid())
  );
CREATE POLICY "manage certificates" ON public.certificates
  FOR ALL USING (public.is_admin_or_manager(auth.uid()))
  WITH CHECK (public.is_admin_or_manager(auth.uid()));

-- Trigger: auto-create profile and default driver role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'driver');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();