CREATE TABLE IF NOT EXISTS public.kitchens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'canteen',
    address TEXT,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    capacity_meals INTEGER DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.inventory (
    id SERIAL PRIMARY KEY,
    kitchen_id INTEGER REFERENCES public.kitchens(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'cooked_meals',
    quantity DOUBLE PRECISION DEFAULT 0.0,
    unit VARCHAR(20) DEFAULT 'kg',
    prep_date TIMESTAMPTZ,
    expiry_at TIMESTAMPTZ,
    storage_temp VARCHAR(50) DEFAULT 'ambient',
    quality_status VARCHAR(50) DEFAULT 'good'
);

CREATE TABLE IF NOT EXISTS public.surplus_batches (
    id SERIAL PRIMARY KEY,
    kitchen_id INTEGER REFERENCES public.kitchens(id) ON DELETE CASCADE,
    food_item VARCHAR(255) NOT NULL DEFAULT 'Mixed Meals',
    description TEXT,
    perishable_category VARCHAR(100) DEFAULT 'cooked_meals',
    quantity DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    prep_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expiry_time TIMESTAMPTZ,
    storage_temp VARCHAR(50) DEFAULT 'ambient',
    status VARCHAR(50) DEFAULT 'pending',
    safety_class VARCHAR(50) DEFAULT 'SAFE_DONATE',
    risk_score DOUBLE PRECISION DEFAULT 0.0,
    predicted_demand DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ngo_partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'ngo',
    contact VARCHAR(255),
    phone VARCHAR(50),
    capacity_kg DOUBLE PRECISION DEFAULT 100.0,
    refrigeration_capacity BOOLEAN DEFAULT TRUE,
    operating_hours VARCHAR(100) DEFAULT '08:00 - 20:00',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    delivery_radius_km DOUBLE PRECISION DEFAULT 15.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.matches (
    id SERIAL PRIMARY KEY,
    surplus_batch_id INTEGER REFERENCES public.surplus_batches(id) ON DELETE CASCADE,
    ngo_id INTEGER REFERENCES public.ngo_partners(id) ON DELETE CASCADE,
    match_score DOUBLE PRECISION DEFAULT 0.0,
    distance_km DOUBLE PRECISION DEFAULT 0.0,
    urgency_level VARCHAR(50) DEFAULT 'normal',
    quantity_allocated DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'proposed',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.redistributions (
    id SERIAL PRIMARY KEY,
    surplus_batch_id INTEGER REFERENCES public.surplus_batches(id) ON DELETE CASCADE,
    ngo_id INTEGER REFERENCES public.ngo_partners(id) ON DELETE CASCADE,
    match_id INTEGER REFERENCES public.matches(id) ON DELETE SET NULL,
    driver_name VARCHAR(255),
    driver_phone VARCHAR(50),
    urgency VARCHAR(50) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'assigned',
    pickup_time TIMESTAMPTZ,
    estimated_delivery TIMESTAMPTZ,
    actual_delivery TIMESTAMPTZ,
    proof_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.alerts (
    id SERIAL PRIMARY KEY,
    kitchen_id INTEGER REFERENCES public.kitchens(id) ON DELETE SET NULL,
    ngo_id INTEGER REFERENCES public.ngo_partners(id) ON DELETE SET NULL,
    severity VARCHAR(50) DEFAULT 'info',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.waste_logs (
    id SERIAL PRIMARY KEY,
    kitchen_id INTEGER REFERENCES public.kitchens(id) ON DELETE CASCADE,
    food_item VARCHAR(255) NOT NULL,
    wasted_quantity_kg DOUBLE PRECISION NOT NULL,
    reason VARCHAR(255) DEFAULT 'expired',
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data into InsForge Postgres
INSERT INTO public.kitchens (id, name, type, address, lat, lng, capacity_meals)
VALUES 
(1, 'University Main Canteen', 'canteen', 'Campus Rd, Pune', 18.5204, 73.8567, 500),
(2, 'Hostel Mess Block-B', 'mess', 'Hostel Circle, Pune', 18.5210, 73.8570, 400),
(3, 'FoodCorp Processing Unit', 'processing_unit', 'MIDC Area, Pune', 18.5290, 73.8740, 1000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ngo_partners (id, name, type, contact, capacity_kg, lat, lng)
VALUES 
(1, 'Annadhan Food Bank', 'food_bank', 'contact@annadhan.org', 200.0, 18.5230, 73.8500),
(2, 'Hope Shelter Home', 'shelter', '+91-90000-00000', 80.0, 18.5310, 73.8620),
(3, 'Seva NGO Kitchen', 'ngo', 'hello@seva.org', 150.0, 18.5150, 73.8680)
ON CONFLICT (id) DO NOTHING;
