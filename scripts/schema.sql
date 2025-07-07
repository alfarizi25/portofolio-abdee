-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    repo_url TEXT,
    demo_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample projects
INSERT INTO projects (title, description, repo_url, demo_url, tech_stack, image_url) VALUES
('E-Commerce Platform', 'Full-stack e-commerce solution with payment integration', 'https://github.com/abdee/ecommerce', 'https://demo.example.com', ARRAY['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'], '/placeholder.svg?height=300&width=400'),
('Task Management App', 'Collaborative task management with real-time updates', 'https://github.com/abdee/taskapp', 'https://tasks.example.com', ARRAY['React', 'Node.js', 'Socket.io', 'MongoDB'], '/placeholder.svg?height=300&width=400'),
('Portfolio Website', 'Modern portfolio with admin dashboard and CMS', 'https://github.com/abdee/portfolio', 'https://abdee.dev', ARRAY['Next.js', 'Tailwind', 'PostgreSQL', 'JWT'], '/placeholder.svg?height=300&width=400');

-- Insert sample gallery items
INSERT INTO gallery (image_url, title, description) VALUES
('/placeholder.svg?height=400&width=600', 'Brand Identity Design', 'Complete brand identity package for tech startup'),
('/placeholder.svg?height=400&width=600', 'Mobile App UI', 'Modern mobile application interface design'),
('/placeholder.svg?height=400&width=600', 'Web Dashboard', 'Analytics dashboard with data visualization');
