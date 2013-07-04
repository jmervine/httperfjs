NODE_LIBS=NODE_PATH=.:./lib/:$(NODE_PATH)
NODE_EXEC=$(NODE_LIBS) ./node_modules/.bin/

console:
	$(NODE_LIBS) node

tests:
	$(NODE_EXEC)nodeunit ./test/*_test.js

setup:
	npm install

clean:
	rm -rf ./node_modules/
