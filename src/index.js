const fetch = require('node-fetch');

let Total = 0;
let Count = 0;
const products = [];

const url = "http://localhost:3000";

const findProducts = async () => {
  let info = await getInfo();
  Total = info.total;
  let left = 0;
  let right = 100000;

  try {
    while(Total > 0) {
      info = await getInfo(left, right);
      console.log('lr',left, right);
      console.log('in',info)
      while (info.total > info.count && left <= right) {
        right = parseInt((left + right) / 2);
        info = await getInfo(left, right);
      }
      console.log('lr1',left, right);
      console.log('in1',info)
      
      const result = await getInfo(left, right, true)

      result.products.forEach(product => products.push(product)); 
      Total -= result.total;

      left = right+1;
      right = 100000;

      if (Total <= 0) {
        return;
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};


const getInfo =async (minPrice = 0, maxPrice = 100000, returnProducts) => {
  // const response = await fetch(url+`?minPrice=${minPrice}&maxPrice=${maxPrice}`)
  try {
    const response = await fetch(url+`?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    const body = await response.text();
    const {total, count } = JSON.parse(body);
    if(returnProducts) {
      return JSON.parse(body);
    }
    return { total, count}

  } catch(error) {
    console.log(error)
  }
};


const answer = async () => {
  await findProducts();
  console.log(products.length);
}

answer();
