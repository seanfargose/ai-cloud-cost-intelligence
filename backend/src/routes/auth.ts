import { Router } from "express";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'cfo' | 'finops_lead' | 'cloud_architect' | 'engineering_lead';
  roleTitle: string;
  organization: string;
  department: string;
  avatar: string;
}

export const BACKEND_DEMO_PERSONAS: AuthUser[] = [
  {
    id: 'persona-finops',
    name: 'Sarah Chen',
    email: 'sarah.chen@enterprise.io',
    role: 'finops_lead',
    roleTitle: 'Director of FinOps',
    organization: 'FinOps Global Corp',
    department: 'Finance & Strategy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'persona-cfo',
    name: 'Alex Morgan',
    email: 'alex.morgan@enterprise.io',
    role: 'cfo',
    roleTitle: 'Chief Financial Officer',
    organization: 'FinOps Global Corp',
    department: 'Executive Leadership',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'persona-architect',
    name: 'Marcus Vance',
    email: 'marcus.vance@enterprise.io',
    role: 'cloud_architect',
    roleTitle: 'Principal Cloud Architect',
    organization: 'FinOps Global Corp',
    department: 'Cloud Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'persona-eng',
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.io',
    role: 'engineering_lead',
    roleTitle: 'VP of Engineering',
    organization: 'FinOps Global Corp',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

const registeredUsers: Map<string, AuthUser> = new Map();

// Pre-populate demo users
BACKEND_DEMO_PERSONAS.forEach((user) => {
  registeredUsers.set(user.email.toLowerCase(), user);
});

export function authRoutes() {
  const router = Router();

  // Get available demo personas
  router.get("/personas", (req, res) => {
    res.json({
      success: true,
      personas: BACKEND_DEMO_PERSONAS,
      timestamp: new Date().toISOString()
    });
  });

  // Login endpoint
  router.post("/login", (req, res) => {
    const { email, password } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = registeredUsers.get(normalizedEmail);

    if (!user) {
      // Auto-create standard user profile
      const namePart = email.split("@")[0].replace(/[._]/g, " ");
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = {
        id: `user-${Date.now()}`,
        name: formattedName,
        email: normalizedEmail,
        role: "finops_lead",
        roleTitle: "FinOps Practitioner",
        organization: "Enterprise Cloud Team",
        department: "FinOps",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedEmail}`
      };
      registeredUsers.set(normalizedEmail, user);
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
      token: `jwt-mock-${user.id}-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  });

  // Register endpoint
  router.post("/register", (req, res) => {
    const { name, email, role, organization } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const roleTitles: Record<string, string> = {
      cfo: "Chief Financial Officer",
      finops_lead: "FinOps Lead",
      cloud_architect: "Cloud Architect",
      engineering_lead: "Engineering Lead"
    };

    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name,
      email: normalizedEmail,
      role: role || "finops_lead",
      roleTitle: roleTitles[role] || "Cloud Analyst",
      organization: organization || "Enterprise Org",
      department: role === "cfo" ? "Finance" : role === "engineering_lead" ? "Engineering" : "Cloud Ops",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedEmail}`
    };

    registeredUsers.set(normalizedEmail, newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token: `jwt-mock-${newUser.id}-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  });

  // Get current user profile
  router.get("/me", (req, res) => {
    const authHeader = req.headers.authorization;
    // Default to first persona
    const defaultUser = BACKEND_DEMO_PERSONAS[0];
    res.json({
      success: true,
      user: defaultUser,
      timestamp: new Date().toISOString()
    });
  });

  return router;
}
