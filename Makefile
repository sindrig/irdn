build:
	npm run build

deploy:
	npm run deploy

install:
	npm install

invalidate:
	aws cloudfront create-invalidation --distribution-id E14VNCYKDXTTW5 --paths /index.html /paskar /home /about /cv / --profile=irdn

clean:
	rm -rf build

update-deps:
	tar czvf node_modules.tar.gz node_modules

unpack-deps:
	tar zxf node_modules.tar.gz

should-deploy:
	npm run should-deploy

trigger-build:
	git commit --allow-empty -m 'Trigger LambCI'
	git push -u origin $$(git rev-parse --abbrev-ref HEAD)

cv:
	cd src/cv && xelatex cv.tex