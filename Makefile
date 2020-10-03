cv:
	docker run --rm -v `pwd`/src/cv:/data -v `pwd`/src/images:/images moss/xelatex make
	mv -f src/cv/cv.pdf public