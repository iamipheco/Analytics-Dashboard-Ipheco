// Mock accounts until a real auth provider (Firebase, Supabase, …) is wired up.
// Passwords are in plain text here because this is demo data only.
export const accounts = [
    { email: "justin@gmail.com", password: "password123", name: "Justin Bergson", role: "Owner" },
    { email: "demo@fasta.app", password: "demo1234", name: "Demo Admin", role: "Admin" },
];

export const SESSION_KEY = "session";
