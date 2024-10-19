CREATE TABLE user_signatures (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    signature TEXT, -- Stores the signature data as a text or base64 image
    date_of_sign TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
    language VARCHAR(10),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);