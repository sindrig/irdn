cv:
	docker run --rm -v `pwd`/cv:/data -v `pwd`/public:/public moss/xelatex make
	mv -f cv/cv.pdf public


view:
	$(BROWSER) public/cv.pdf
	while inotifywait --event modify,move_self,close_write cv/cv.tex; \
		do make cv; done


.PHONY: cv