# Database Setup Guide & Vercel Integration

## 1. Local Setup

### Prerequisite: MySQL Server
**Important**: DBeaver is a **Client** (a tool to manage databases), but you still need a **Server** running.
*   If you have **XAMPP**, start the **MySQL** module in XAMPP Control Panel.
*   If you installed **MySQL Community Server** separately, ensure the service is running.

### Using DBeaver (Recommended for Security/Ease)

1.  **Open DBeaver**.
2.  **New Connection**: Click the Plug icon (device with a plus) in the top left.
3.  Select **MySQL** and click **Next**.
4.  **Connection Settings**:
    *   **Server Host**: `localhost`
    *   **Port**: `3306`
    *   **Username**: `root`
    *   **Password**: (Leave empty if using default XAMPP, or enter your secure password).
    *   Click **Test Connection** to ensure it works.
    *   Click **Finish**.
5.  **Create Database**:
    *   Right-click on your new connection (localhost) in the sidebar.
    *   Select **Create** > **Database**.
    *   Name it: `db_blink`.
    *   Click **OK**.
6.  **Run Schema Script**:
    *   Double-click on the new `db_blink` database to make it active (bold).
    *   At the top menu, click **SQL Editor** > **Open SQL Script**.
    *   Select the file `db_blink_schema.sql` from your project folder.
    *   (Alternatively, copy the content of the file and paste it into a new SQL Editor window).
    *   Click the **Execute SQL Script** button (orange play arrow) on the left of the toolbar.

### Update `.env` File
If you set a specific password for your root user, update your `.env` file:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/db_blink"
```

---

## 2. Vercel Setup (For Deployment)

When deploying to Vercel, you cannot use your local database. You need a Cloud Database.

### Step 1: Create Cloud Database (Free)
1.  Go to [Aiven.io](https://aiven.io/) or [PlanetScale](https://planetscale.com/) or [Supabase](https://supabase.com/).
2.  Create a free **MySQL** service.
3.  Get the **Service URI** (Connection String). It looks like: `mysql://user:password@host:port/defaultdb`

### Step 2: Add Environment Variable in Vercel
1.  Go to your Vercel Dashboard > Project Settings > Environment Variables.
2.  Key: `DATABASE_URL`
3.  Value: (Paste your Cloud Connection String).
4.  **Redeploy** your project.
