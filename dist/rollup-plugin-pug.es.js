import { createFilter } from 'rollup-pluginutils';
import { compile } from 'pug';
import { extname } from 'path';

function pug$1 (options) {
  if (!options) options = {};

  var EXCL_PROPS = ['extensions', 'include', 'exclude'];

  // prepare extensions to match with the extname() result
  function normalizeExtensions (exts) {
    if (exts) {
      for (var i = 0; i < exts.length; i++) {
        var ext = exts[i].toLowerCase();
        exts[i] = ext[0] !== '.' ? '.' + ext : ext;
      }
    } else {
      exts = ['.jade', '.pug'];
    }
    return exts;
  }

  // clone options & drop properties not necessary for pug compiler
  function normalizeOptions (opts) {
    var dest = {
      doctype: 'html',
      name: 'template',
      compileDebug: false,
      inlineRuntimeFunctions: false,
      context: {},
    };
    for (var p in opts) {
      if (opts.hasOwnProperty(p) && EXCL_PROPS.indexOf(p) === -1) {
        dest[p] = opts[p];
      }
    }
    dest.globals = ['require'].concat(opts.globals || []);

    return dest;
  }

  var extensions = normalizeExtensions(options.extensions);
  var filter = createFilter(options.include, options.exclude);
  var opts = normalizeOptions(options);

  return {
    transform (code, id) {
      if (filter(id) && ~extensions.indexOf(extname(id).toLowerCase())) {
        opts.filename = id;
        let compiled = compile(code, opts)(opts.context);
        return 'export default ' + JSON.stringify(compiled);
      }
      return null;
    },
    name: 'rollup-plugin-pug-html'
  };
}

export default pug$1;