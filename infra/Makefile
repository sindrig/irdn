.DEFAULT_GOAL := update

clean:
	letsencrypt/clean.sh

build:
	letsencrypt/build.sh

upload:
	./upload.sh

update: upload
	python build.py cloudformation lambda trigger
