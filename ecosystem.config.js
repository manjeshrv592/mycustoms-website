module.exports = {
  apps: [
    {
      name: "mycustoms-website",
      script: "npm",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
    },
  ],
};
