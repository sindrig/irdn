#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ ! -f "$DIR/letsencrypt/code.zip" ]; then
    echo "No letsencrypt/code.zip found, build first!"
    exit 1
fi
