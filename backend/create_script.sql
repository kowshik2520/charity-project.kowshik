-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Create campaigns table
CREATE TABLE campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each campaign
    name TEXT NOT NULL,                   -- Name of the campaign
    description TEXT,                     -- Description of the campaign
    goal_amount REAL NOT NULL,            -- Goal amount for the campaign
    reached_amount REAL DEFAULT 0,        -- Amount reached so far, defaults to 0
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Date the campaign was created
    updated_date DATETIME DEFAULT CURRENT_TIMESTAMP  -- Date the campaign was last updated
);

-- Create donations table
CREATE TABLE donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each donation
    donor_name TEXT NOT NULL,             -- Name of the donor
    email TEXT,                           -- Email of the donor
    address TEXT,                         -- Address of the donor
    phone_number TEXT,                    -- Phone number of the donor
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Date the donation was made
    campaign_id INTEGER NOT NULL,         -- Associated campaign ID
    FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE
);
