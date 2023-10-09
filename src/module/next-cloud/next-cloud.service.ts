import Client, { Server } from 'nextcloud-node-client';
export function createNextClient() {
  const server = new Server({
    basicAuth: {
      password: process.env.NEXTCLOUD_PASSWORD,
      username: process.env.NEXTCLOUD_USERNAME,
    },
    url: process.env.NEXTCLOUD_URL,
  });
  return new Client(server);
}
