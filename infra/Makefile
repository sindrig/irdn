.DEFAULT_GOAL := update

delete:
	python build.py delete

clean:
	letsencrypt/clean.sh

build:
	letsencrypt/build.sh

prepare:
	./prepare.sh

update: prepare
	python build.py cloudformation lambda trigger

all: clean build update