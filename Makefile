build:
	npm run build

deploy:
	./node_modules/.bin/s3-deploy './build/**' --cwd './build/' --region eu-west-1 --bucket irdn.is

deploy-local:
	./node_modules/.bin/s3-deploy './build/**' --cwd './build/' --region eu-west-1 --bucket irdn.is --profile=irdn

install:
	npm install

invalidate:
	aws cloudfront create-invalidation --distribution-id E14VNCYKDXTTW5 --paths /index.html /paskar /home /about /cv --profile=irdn

clean:
	rm -rf build