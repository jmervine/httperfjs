NODE_LIBS=NODE_PATH=.:./lib/:$(NODE_PATH)
NODE_EXEC=$(NODE_LIBS) ./node_modules/.bin/

console:
	$(NODE_LIBS) node

test: unit functional .PHONY

unit:
	# Running Unit Tests
	$(NODE_EXEC)nodeunit ./test/*_test.js

functional:
	# Running Functional Tests
	$(NODE_EXEC)nodeunit ./test/functional.js

setup:
	npm install

clean:
	rm -rf ./node_modules/

.PHONY:
