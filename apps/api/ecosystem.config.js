module.exports = {
  apps: [
    {
      name: 'chronos-api',
      script: '/root/projects/chronos-platform/apps/api/dist/main.js',
      cwd: '/root/projects/chronos-platform/apps/api',
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 5,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'production',
        PORT: '3002',
        DATABASE_URL: 'postgresql://chronos:chronos_secret@localhost:5432/chronos',
      },
    },
  ],
};
