import arg from './arguments';
import update from './update';

if (!arg.authKey || !arg.dnsRecord || !arg.domain || !arg.email) {
  console.error('Please use --help to see arguments required.');
  process.exit(1);
}

function cron() {
  setTimeout(() => {
    update(arg.domain, arg.dnsRecord, arg.email, arg.authKey)
      .catch((error) => console.error(error))
      .finally(() => cron());
  }, arg.interval);
}

update(arg.domain, arg.dnsRecord, arg.email, arg.authKey)
  .catch((error) => console.error(error.code, error.payload))
  .finally(() => cron());
