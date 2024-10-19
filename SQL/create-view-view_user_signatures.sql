CREATE VIEW view_user_signatures AS
SELECT 
    auth.users.id AS user_id,
    auth.users.email AS email,
    auth.users.created_at,
    COALESCE(user_signatures.name, '') AS name,  -- Return empty string if no record
    COALESCE(user_signatures.company, '') AS company,  -- Return empty string if no record
    COALESCE(user_signatures.signature, '') AS signature,  -- Return empty string if no record
    COALESCE(user_signatures.language, 'en') AS language,  -- Fallback to 'en' if no record
    COALESCE(user_signatures.date_of_sign, NOW()) AS date_of_sign,  -- Default to current date if no record
    COALESCE(user_signatures.is_active, TRUE) AS is_active  -- Default to TRUE if no record
FROM 
    auth.users
LEFT JOIN 
    user_signatures ON auth.users.id = user_signatures.user_id;