deploy:
	npm run build
	aws s3 sync build s3://irdn.is --profile=irdn
