module.exports = {
  apps: [
    {
      name: 'be-api',
      script: 'yarn',
      args: 'start:prod',
      autorestart: true,
    },
  ],
};
