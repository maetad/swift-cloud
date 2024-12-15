# Swift Cloud

The #1 app for Talor Swifies!

![swifties](https://i.imgflip.com/8dn68t.jpg)

## Getting Started

### 1. Configure the Environment

Update the configuration in `.env.development` with the appropriate values.

### 2. Start the Services

Run the following command to start the application using Docker Compose:

```bash
docker compose up -d
```

### 3. Seed the Database

1. Open Adminer by navigating to [http://localhost:8080](http://localhost:8080).
2. Log in using the database credentials from `.env.development`.
3. Locate the seed data scripts in src/database/seeds.
4. Execute the SQL scripts in order, starting from `1-artists.sql` to `7-song-views.sql`.
