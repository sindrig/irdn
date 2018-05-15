make unpack-deps;

if make should-deploy; then
    make build && make deploy
fi