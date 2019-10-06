#!/bin/sh
# Run the test-cases
yarn test || exit 1
# Everything passed.
exit 0
