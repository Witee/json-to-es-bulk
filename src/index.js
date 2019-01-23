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

import fs from 'fs';
import _ from 'lodash';

const inputFileName = 'xxx.json';
const outputFileName = 'yyy.json';

const inputJsonString = fs.readFileSync(inputFileName, 'utf8');

const inputJson = JSON.parse(inputJsonString).hits.hits;

const stream = fs.createWriteStream(outputFileName, { encoding: 'utf8' });

// eslint-disable-next-line
console.log('Writing records...');

let counter = 0;

stream.once('open', () => {
  _.each(inputJson, (record) => {
    // eslint-disable-next-line
    const recordPrologue = { index: { _index: record._index, _type: record._type, _id: record._id } };
    stream.write(`${JSON.stringify(recordPrologue)}\n`);
    // eslint-disable-next-line
    stream.write(`${JSON.stringify(record._source)}\n`);

    counter += 1;
  });

  stream.end();
});

// eslint-disable-next-line
stream.on('error', (err) => { console.log('err: ', err); });

stream.on('finish', () => {
  // eslint-disable-next-line
  console.log(`completed, wrote: ${counter} record(s)`);
});
