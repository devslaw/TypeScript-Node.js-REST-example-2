all:
	docker-compose build

run:
	docker-compose up web

shell:
	docker-compose run --rm web /bin/bash

stop:
	docker-compose down