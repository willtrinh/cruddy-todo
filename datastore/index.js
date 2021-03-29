const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('create error: ', err);
    } else {
      var file = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(file, text, (err) => {
        if (err) {
          console.log('cannot write to file');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(path.join(exports.dataDir), (err, files) => {
    if (err) {
      console.log('cannot read files');
    } else {
      _.each(files, file => {
        // get just the id without .txt extension
        var id = path.parse(file).name;
        data.push({id, text: id});
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text});
    }
  });
};

exports.update = (id, text, callback) => {
  var file = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(file, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(file, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var file = path.join(exports.dataDir, `${id}.txt`);

  fs.unlink(file, (err) => {
    if (err) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
