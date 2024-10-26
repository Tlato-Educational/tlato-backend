/// <reference types="node" />

enum NodeEnv {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      MONGODB_URI_LOCAL: string;
      SESSION_SECRET: string;
      FACEBOOK_ID: string;
      FACEBOOK_SECRET: string;
      SENDGRID_USER: string;
      SENDGRID_PASSWORD: string;
      PORT: string;
      NODE_ENV: NodeEnv;
    }
  }
}

export {};
