TAG=sindrigudmundsson/irdn:`git rev-parse --abbrev-ref HEAD`-`git rev-parse HEAD`

build:
	docker build -t ${TAG} .

push: build
	docker push ${TAG}