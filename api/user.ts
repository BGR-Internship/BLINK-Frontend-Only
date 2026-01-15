import pool from './db';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (request.method === 'GET') {
        try {
            // For demo purposes, we fetch the first user or a specific test user
            // In a real app, you'd decode a token to get the user ID
            const [rows] = await pool.query('SELECT * FROM users LIMIT 1');
            if (Array.isArray(rows) && rows.length > 0) {
                return response.status(200).json(rows[0]);
            }
            return response.status(404).json({ error: 'User not found' });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to fetch user' });
        }
    }

    if (request.method === 'POST') {
        try {
            const { id, nik, email, location, bio } = request.body;
            // Simple update logic
            // Ideally, use a WHERE clause based on authenticated user
            await pool.query(
                'UPDATE users SET full_name = ?, email = ?, location = ?, bio = ? WHERE nik = ?',
                [id, email, location, bio, nik]
            );
            return response.status(200).json({ message: 'Profile updated' });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to update user' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
