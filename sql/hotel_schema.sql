
-- Table: guest
CREATE TABLE guest (
    customer_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_creation TIMESTAMP,
    name VARCHAR(255),
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    nationality VARCHAR(100),
    is_marketing BOOLEAN,
    telephone VARCHAR(20),
    email VARCHAR(255),
    address TEXT
);

-- Table: reservation
CREATE TABLE reservation (
    reservation_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_int_id UUID NOT NULL,
    date_created TIMESTAMP,
    date_updated TIMESTAMP,
    status VARCHAR(50),
    total_price DECIMAL(10, 2),
    principal_guest UUID,
    booking_source VARCHAR(50),
    entry_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (room_int_id) REFERENCES rooms(room_int_id),
    FOREIGN KEY (principal_guest) REFERENCES guest(customer_int_id)
);

-- Table: payment
CREATE TABLE payment (
    payment_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL,
    guest_int_id UUID NOT NULL,
    deposit DECIMAL(10, 2),
    date_created TIMESTAMP,
    date_updated TIMESTAMP,
    type VARCHAR(50),
    method VARCHAR(50),
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_int_id),
    FOREIGN KEY (guest_int_id) REFERENCES guest(customer_int_id)
);

-- Table: request
CREATE TABLE request (
    request_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL,
    guest_int_id UUID NOT NULL,
    type VARCHAR(100),
    plain_request TEXT,
    feasibility BOOLEAN,
    price DECIMAL(10, 2),
    date_created TIMESTAMP,
    date_updated TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_int_id),
    FOREIGN KEY (guest_int_id) REFERENCES guest(customer_int_id)
);

-- Table: service
CREATE TABLE service (
    service_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL,
    guest_int_id UUID NOT NULL,
    date_created TIMESTAMP,
    date_updated TIMESTAMP,
    service VARCHAR(100),
    type VARCHAR(100),
    price DECIMAL(10, 2),
    availability BOOLEAN,
    raw_service TEXT,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_int_id),
    FOREIGN KEY (guest_int_id) REFERENCES guest(customer_int_id)
);

-- Table: guest_satisfaction
CREATE TABLE guest_satisfaction (
    satisfaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL,
    guest_int_id UUID NOT NULL,
    date_created TIMESTAMP,
    date_updated TIMESTAMP,
    rating INT,
    update_reason TEXT,
    comment TEXT,
    NPS INT,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_int_id),
    FOREIGN KEY (guest_int_id) REFERENCES guest(customer_int_id)
);

-- Table: tariff
CREATE TABLE tariff (
    tariff_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_int_id UUID NOT NULL,
    reservation_id UUID NOT NULL,
    price DECIMAL(10, 2),
    date_created TIMESTAMP,
    date_updated TIMESTAMP,
    update_reason TEXT,
    description TEXT,
    is_causal BOOLEAN,
    FOREIGN KEY (room_int_id) REFERENCES rooms(room_int_id),
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_int_id)
);

-- Table: rooms
CREATE TABLE rooms (
    room_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number VARCHAR(20),
    status VARCHAR(50),
    beds INT,
    max_guests INT,
    is_ready BOOLEAN
);

-- Table: room_status
CREATE TABLE room_status (
    status_int_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_int_id UUID NOT NULL,
    status VARCHAR(50),
    date_created TIMESTAMP,
    date_updated TIMESTAMP,
    has_problems BOOLEAN,
    problem TEXT,
    FOREIGN KEY (room_int_id) REFERENCES rooms(room_int_id)
);
