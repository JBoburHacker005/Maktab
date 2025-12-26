# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

https://ima-uz.vercel.app

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Admin Panel Setup

To create an admin user for the admin panel:

1. **Go to Supabase Dashboard**
   - Navigate to your Supabase project
   - Go to **Authentication** > **Users**
   - Click **"Add user"** > **"Create new user"**

2. **Create the user with these credentials:**
   - **Email**: `jbobur005@gmail.com`
   - **Password**: `boburbek005`
   - **Auto Confirm User**: Yes (check this box)
   - Click **"Create user"**

3. **Assign Admin Role**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run this SQL query:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role
   FROM auth.users
   WHERE email = 'jbobur005@gmail.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

Alternatively, you can run the migration file:
```sh
supabase migration up
```

This will automatically assign the admin role to the user if they exist in the database.
