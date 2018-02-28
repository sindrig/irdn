build:
	npm run build

deploy:
	s3-deploy './build/**' --cwd './build/' --region eu-west-1 --bucket irdn.is
	
install:
	npm install
