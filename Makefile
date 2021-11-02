cv:
	docker run --rm -v `pwd`/cv:/data -v `pwd`/public:/public moss/xelatex make
	mv -f cv/cv.pdf public

.PHONY: cv