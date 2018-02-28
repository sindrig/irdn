build:
	npm run build

deploy:
	./node_modules/.bin/s3-deploy './build/**' --cwd './build/' --region eu-west-1 --bucket irdn.is
	
install:
	npm install
