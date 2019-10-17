ASSETS_DIR := assets/vendor

all: create_dirs bootstrap fontawesome simplecrypto

create_dirs:
	mkdir -p $(ASSETS_DIR)/js
	mkdir -p $(ASSETS_DIR)/scss

bootstrap:
	cp node_modules/jquery/dist/jquery.min.js $(ASSETS_DIR)/js/
	cp node_modules/popper.js/dist/umd/popper.min.js $(ASSETS_DIR)/js/
	cp node_modules/bootstrap/dist/js/bootstrap.min.js $(ASSETS_DIR)/js/
	cp -r node_modules/bootstrap/scss $(ASSETS_DIR)/scss/bootstrap

fontawesome:
	cp -r node_modules/\@fortawesome/fontawesome-free/webfonts static/
	cp -r node_modules/\@fortawesome/fontawesome-free/scss/ $(ASSETS_DIR)/scss/fontawesome

simplecrypto:
	cp node_modules/simple-crypto-js/dist/SimpleCrypto.min.js $(ASSETS_DIR)/js/

clean:
	rm -r $(ASSETS_DIR) static/webfonts
