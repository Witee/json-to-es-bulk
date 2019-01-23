# json-to-es-bulk
JSON 格式数据转换成 ES bulk 接口格式数据

#### 修改 ./src/index.js

- `inputFileName` : 原始数据文件名
- `outputFileName`: 存储 `bulk` 格式数据文件名

`inputFileName` 为输入文件，格式是 `ES` 查询出来的结果

```
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

```

`outputFileName` 为 `bulk` 格式的输出文件

```
  {"index":{"_index":"index-name","_type":"type-name","_id":"1"}}
  {"name": "some name", "age": 18}
  ...
```

写入ES方法:

```
  curl -XPOST http://localhost:9200/index-name/type-name/_bulk --data-binary @yyy.json
```
