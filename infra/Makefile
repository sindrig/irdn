.DEFAULT_GOAL := update

clean:
	letsencrypt/clean.sh

build:
	letsencrypt/build.sh

prepare:
	./prepare.sh

update: prepare
	python build.py cloudformation lambda # trigger
