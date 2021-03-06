'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  生成 ES bulk 接口使用的数据格式

  inputFileName 为输入文件，格式是 ES 查询出来的结果
  如:
  inputFileName = {
    hits: {
      hits:[
        {
          "_index": "index-name",
          "_type": "fans",
          "_id": "1",
          "_score": 1,
          "_source": {
            "name": "some name",
            "age": 18
          }
        },
        ...
      ]
    }
  }

  outputFileName 为 bulk 格式的输出文件
  如:
    {"index":{"_index":"index-name","_type":"type-name","_id":"1"}}
    {"name": "some name", "age": 18}
    ...

  写入ES方法:
  curl -XPOST http://localhost:9200/index-name/type-name/_bulk --data-binary @yyy.json

  @author Witee<github.com/Witee>
  @date   2019-01-23
*/

var inputFileName = 'xxx.json';
var outputFileName = 'yyy.json';

var inputJsonString = _fs2.default.readFileSync(inputFileName, 'utf8');

var inputJson = JSON.parse(inputJsonString).hits.hits;

var stream = _fs2.default.createWriteStream(outputFileName, { encoding: 'utf8' });

// eslint-disable-next-line
console.log('Writing records...');

var counter = 0;

stream.once('open', function () {
  _lodash2.default.each(inputJson, function (record) {
    // eslint-disable-next-line
    var recordPrologue = { index: { _index: record._index, _type: record._type, _id: record._id } };
    stream.write(JSON.stringify(recordPrologue) + '\n');
    // eslint-disable-next-line
    stream.write(JSON.stringify(record._source) + '\n');

    counter += 1;
  });

  stream.end();
});

// eslint-disable-next-line
stream.on('error', function (err) {
  console.log('err: ', err);
});

stream.on('finish', function () {
  // eslint-disable-next-line
  console.log('completed, wrote: ' + counter + ' record(s)');
});