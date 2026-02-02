-- Check vehicle_type ENUM values
SELECT unnest(enum_range(NULL::vehicle_type)) AS vehicle_types;
