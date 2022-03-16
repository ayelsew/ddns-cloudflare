# ! /bin/bash

sudo systemctl disable ddns-cloudflare.service

sudo systemctl stop ddns-cloudflare.service

sudo rm /etc/systemd/system/ddns-cloudflare.service

sudo systemctl daemon-reload

sudo rm /opt/ddns-cloudflare-linux 
