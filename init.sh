docker-compose up -d
chown -R $(docker-compose exec grafana id -u | sed 's/\r//g') ./grafana/plugins
chown -R $(docker-compose exec prometheus-server id -u | sed 's/\r//g') ./prometheus/data
