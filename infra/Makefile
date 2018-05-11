.DEFAULT_GOAL := update

clean:
	letsencrypt/clean.sh

install:
	letsencrypt/build.sh

build: clean install
	zip -qyr code.zip . -x@.lambdaignore

upload: build
	aws s3 cp code.zip s3://vikes-result-code/code.zip --profile=irdn
	aws s3 cp match-results.template s3://vikes-result-code/match-results.template --profile=irdn
	echo https://s3.amazonaws.com/vikes-result-code/match-results.template > /dev/null
	echo https://s3.amazonaws.com/vikes-result-code/code.zip > /dev/null

update: upload
	python build.py cloudformation lambda trigger
