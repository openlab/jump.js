java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../bing-maps/jump.js --js_output_file ../bing-maps/minified/jump.min.js
Packer -o ../bing-maps/minified/jump.min.js -m packer ../bing-maps/minified/jump.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../bing-maps/overlays/jump.overlays.js --js_output_file ../bing-maps/minified/jump.overlays.min.js
Packer -o ../bing-maps/minified/jump.overlays.min.js -m packer ../bing-maps/minified/jump.overlays.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../bing-maps/services/jump.services.js --js_output_file ../bing-maps/minified/jump.services.min.js
Packer -o ../bing-maps/minified/jump.services.min.js -m packer ../bing-maps/minified/jump.services.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../bing-maps/metadata/jump.rdfa.js --js_output_file ../bing-maps/minified/jump.rdfa.min.js
Packer -o ../bing-maps/minified/jump.rdfa.min.js -m packer ../bing-maps/minified/jump.rdfa.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../bing-maps/metadata/jump.microdata.js --js_output_file ../bing-maps/minified/jump.microdata.min.js
Packer -o ../bing-maps/minified/jump.microdata.min.js -m packer ../bing-maps/minified/jump.microdata.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../bing-maps/metadata/jump.microformat.js --js_output_file ../bing-maps/minified/jump.microformat.min.js
Packer -o ../bing-maps/minified/jump.microformat.min.js -m packer ../bing-maps/minified/jump.microformat.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../bing-maps/jump.full.js --js_output_file ../bing-maps/minified/jump.full.min.js
Packer -o ../bing-maps/minified/jump.full.min.js -m packer ../bing-maps/minified/jump.full.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../google-maps/jump.js --js_output_file ../google-maps/minified/jump.min.js
Packer -o ../google-maps/minified/jump.min.js -m packer ../google-maps/minified/jump.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../google-maps/overlays/jump.overlays.js --js_output_file ../google-maps/minified/jump.overlays.min.js
Packer -o ../google-maps/minified/jump.overlays.min.js -m packer ../google-maps/minified/jump.overlays.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../google-maps/services/jump.services.js --js_output_file ../google-maps/minified/jump.services.min.js
Packer -o ../google-maps/minified/jump.services.min.js -m packer ../google-maps/minified/jump.services.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../google-maps/metadata/jump.rdfa.js --js_output_file ../google-maps/minified/jump.rdfa.min.js
Packer -o ../google-maps/minified/jump.rdfa.min.js -m packer ../google-maps/minified/jump.rdfa.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../google-maps/metadata/jump.microdata.js --js_output_file ../google-maps/minified/jump.microdata.min.js
Packer -o ../google-maps/minified/jump.microdata.min.js -m packer ../google-maps/minified/jump.microdata.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../google-maps/metadata/jump.microformat.js --js_output_file ../google-maps/minified/jump.microformat.min.js
Packer -o ../google-maps/minified/jump.microformat.min.js -m packer ../google-maps/minified/jump.microformat.min.js

java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js ../google-maps/jump.full.js --js_output_file ../google-maps/minified/jump.full.min.js
Packer -o ../google-maps/minified/jump.full.min.js -m packer ../google-maps/minified/jump.full.min.js

pause