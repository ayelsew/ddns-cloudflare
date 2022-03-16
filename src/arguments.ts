import time from './time';

interface Arguments {
  domain: string;
  dnsRecord: string;
  email: string;
  authKey: string;
  interval: number;
}

const arg: Arguments = {
  domain: '',
  dnsRecord: '',
  email: '',
  authKey: '',
  interval: time('1m')
}


const needHelp = process.argv.find((argName) => (/--help/.test(argName) || /-h/.test(argName)));

if (needHelp) {
  console.log(`
  Dynamic DNS Cloudflare (unofficial)

  --domain (required) - The domain base to detect zone ID
  -d
  
  --dns-record (required) - The domain DNS record to be update
  -dr
  
  --email (required) - Your email as administrator
  -e
  
  --auth-key (required) - Token of authentication with permision to edit DNS
  -ak
  
  --interval (optional) - Interval to check and update DNS record (see Interval pattern)
  -i

  Interval pattern
    s - seconds
    m - minutes
    h - hours
    d - day
    w - week
  
  e.g: 2h for two hours or 4w four weeks
  e.g: -d examble.com -dr api.examble.com -e admin@example -ak j3y37t73dgghfasvkjldhaksd -i 30m
  `);
  process.exit(0);
}

process.argv.forEach((argName, index) => {

  if (/^--domain$/.test(argName) || /^-d$/.test(argName))
    arg.domain = process.argv[index + 1];

  if (/^--dns-record$/.test(argName) || /^-dr$/.test(argName))
    arg.dnsRecord = process.argv[index + 1];

  if (/^--email$/.test(argName) || /^-e$/.test(argName))
    arg.email = process.argv[index + 1];

  if (/^--auth-key$/.test(argName) || /^-ak$/.test(argName))
    arg.authKey = `Bearer ${process.argv[index + 1]}`;

  if (/^--interval$/.test(argName) || /^-i$/.test(argName))
    arg.interval = time(process.argv[index + 1]);

})

export default arg;
