import pool from './db';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (request.method === 'GET') {
        try {
            // Fetch Config
            const [configRows] = await pool.query('SELECT * FROM site_config');

            // Fetch Popup Images
            const [imageRows] = await pool.query('SELECT * FROM popup_images ORDER BY sort_order ASC');

            const config: Record<string, any> = {};
            if (Array.isArray(configRows)) {
                configRows.forEach((row: any) => {
                    config[row.config_key] = row.config_value;
                });
            }

            // Format images
            config.popupImages = Array.isArray(imageRows) ? imageRows.map((r: any) => r.image_url) : [];

            // Convert boolean string to boolean
            if (config.popupActive === 'true') config.popupActive = true;
            if (config.popupActive === 'false') config.popupActive = false;

            return response.status(200).json(config);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to fetch config' });
        }
    }

    if (request.method === 'POST') {
        try {
            const updates = request.body;

            // Handle popup images separately if present
            if (updates.popupImages && Array.isArray(updates.popupImages)) {
                await pool.query('DELETE FROM popup_images'); // Clear old images
                const imageValues = updates.popupImages.map((url: string, index: number) => [url, index]);
                if (imageValues.length > 0) {
                    await pool.query('INSERT INTO popup_images (image_url, sort_order) VALUES ?', [imageValues]);
                }
                delete updates.popupImages;
            }

            // Update site_config table
            for (const [key, value] of Object.entries(updates)) {
                let valToStore = value;
                if (typeof value === 'boolean') valToStore = value ? 'true' : 'false';

                await pool.query(
                    'INSERT INTO site_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
                    [key, valToStore, valToStore]
                );
            }

            return response.status(200).json({ message: 'Config updated' });

        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to update config' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
