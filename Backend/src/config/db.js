import mongoose from 'mongoose';
import dns from 'node:dns';

const publicDns = ['8.8.8.8', '1.1.1.1'];

const useFallbackDnsIfLoopback = () => {
  if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
    return;
  }

  const servers = dns.getServers();
  const isLoopback = servers.every((server) =>
    ['127.0.0.1', '::1', '0.0.0.0'].includes(server.replace(/^::ffff:/, ''))
  );

  if (isLoopback) {
    dns.setServers(publicDns);
  }
};

const maskUri = (uri = '') =>
  uri.replace(/\/\/([^:@/]+):([^@/]+)@/, '//$1:****@');

const diagnose = (error, uri) => {
  const host = uri.split('@')[1]?.split('/')[0] ?? uri;
  const isSrv = uri.startsWith('mongodb+srv://');

  const incompleteHost = isSrv && /^cluster\d+\.mongodb\.net$/.test(host);
  const incompleteHint = incompleteHost
    ? 'That hostname is incomplete. Atlas hostnames look like cluster0.abcde123.mongodb.net. Copy the exact URI from Atlas > Database > Connect > Drivers and paste it into .env as MONGO_URI.'
    : 'Copy the exact connection string from Atlas and verify your IP is allowed under Network Access.';

  if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoServerSelectionError') {
    return [
      `Could not reach MongoDB at ${host}.`,
      isSrv
        ? `DNS lookup of _mongodb._tcp.${host} returned no records.`
        : 'The host is unreachable or the port is closed.',
      incompleteHint,
    ].join('\n  ');
  }

  if (/querySrv/.test(error.message) || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return [
      `DNS resolution failed for ${host}.`,
      isSrv
        ? 'The SRV record for this hostname does not exist, so the hostname in MONGO_URI is wrong or incomplete.'
        : 'Check the hostname in MONGO_URI.',
      incompleteHint,
    ].join('\n  ');
  }

  if (/Authentication failed|bad auth/i.test(error.message)) {
    return 'Wrong username or password. If the password contains @ : / ? # [ ] % use percent-encoding, e.g. @ = %40.';
  }

  return error.message;
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MongoDB Connection Error: MONGO_URI is not set. Add it to Backend/.env');
    process.exit(1);
  }

  if (!/^mongodb(\+srv)?:\/\/.+/.test(uri)) {
    console.error(`MongoDB Connection Error: MONGO_URI is malformed: ${maskUri(uri)}`);
    process.exit(1);
  }

  try {
    useFallbackDnsIfLoopback();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected Successfully -> ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${diagnose(error, uri)}\n  URI: ${maskUri(uri)}`);
    process.exit(1);
  }
};

export default connectDB;
