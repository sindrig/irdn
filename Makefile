build:
	npm run build
	rm -f build/cv.log build/cv.out build/cv.aux

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
	docker run --rm -v `pwd`/src/cv:/data -v `pwd`/src/images:/images moss/xelatex make
	mv -f src/cv/cv.pdf public