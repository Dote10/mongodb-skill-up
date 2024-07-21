const axios = require('axios');

//populate 사용하는 방법
//    -blogsLimit 20일 때: 0.8초
//    -blogsLimit 50일 때: 0.7초
//    -blogsLimit 200일 때: 2초

//nesting 사용하는 방법
//    -blogsLimit 20일 때: 0.05~7초
//    -blogsLimit 50일 때: 0.08~10초
//    -blogsLimit 200일 때: 0.2~3초

const URI = 'http://localhost:4000';
const test = async () => {
  console.time('loading time: ');
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);
  //console.dir(blogs[0], { depth: 10 });
  console.timeEnd('loading time: ');
};

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
};

testGroup();
