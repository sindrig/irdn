#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cat $DIR/.gitignore | xargs printf -- "$DIR%s\n" | xargs rm -r
