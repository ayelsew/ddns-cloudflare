# ! /bin/bash

mkdir tmp

cd tmp

wget https://github.com/ayelsew/ddns-cloudflare/releases/download/1.0.0/ddns-cloudflare-linux

echo "\033[0;36m Type the root domain e.g example.com:\033[0m" 
read domain

echo "\033[0;36m Type the DNS record to update e.g api.example.com:\033[0m" 
read dnsRecordName

echo "\033[0;36m Type the admin email e.g admin@example.com: \033[0m" 
read email

echo "\033[0;36m Type the token with permissions to edit DNS (while you type, it will not be shown): \033[0m" 
stty -echo
read token
stty echo
echo ''

echo "\033[0;36m Type the interval to update e.g 60s, 30m, 1h, 7d: \033[0m" 
read -p "" interval

touch ddns-cloudflare.service

echo "
[Unit]
Description=Dynamic DNS Cloudflare Unofficial
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/opt/ddns-cloudflare-linux -d $domain -dr $dnsRecordName -e $email -ak $token -i $interval

[Install]
WantedBy=multi-user.target
" > ddns-cloudflare.service

sudo mv ddns-cloudflare-linux /opt
chmod +x /opt/ddns-cloudflare-linux
sudo mv ddns-cloudflare.service /etc/systemd/system

sudo systemctl daemon-reload
sudo systemctl start ddns-cloudflare.service

echo 'Start as a service at systemclt...'
sleep 5

systemctl is-active --quiet ddns-cloudflare.service

if [ $? -eq 0 ]; then
    echo "\033[0;32m Dynamic DNS Cloudflare was setup with success.\033[0m"
    echo "\033[0;32m Type sudo systemctl status ddns-cloudflare.service to see status.\033[0m"
    echo "\033[0;32m For support: wesley.waaraujo@gmail.com.\033[0m"
    cd ../

    rm -rf tmp
    exit 0
else
    echo "\033[0;31m Unexpected error, reverting instalation.\033[0m"
    sudo systemctl disable ddns-cloudflare.service

    sudo systemctl stop ddns-cloudflare.service

    sudo rm /etc/systemd/system/ddns-cloudflare.service

    sudo systemctl daemon-reload

    sudo rm /opt/ddns-cloudflare-linux 

    cd ../

    rm -rf tmp

    echo "\033[0;31m You have the right credentials at Cloudflare ?\033[0m"
    echo "\033[0;31m For support: wesley.waaraujo@gmail.com"
    exit 1
fi
