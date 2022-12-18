const fetch = require("node-fetch");
const url = "http://localhost:3000";
const products = [];
let Total = 0;

const findProducts = async () => {
  try {
    let info = await getInfo(); // find how many products is coming from url
    Total = info.total; // Total is product total value
    let left = 0; // min price
    let right = 100000; //max Price

    // while we can not recive all products we working to fetch them
    while (Total > 0) {
      info = await getInfo(left, right);

      // if we have more product in left..rigth range we split this segment and decrease the max Price
      while (info.total > info.count && left < right) {
        right = parseInt((left + right) / 2);
        info = await getInfo(left, right);
      }

      // if total is 0 we can not have prodcut this range so its not importent to get products
      if (info.total != 0) {
        const result = await getInfo(left, right, true);

        // get products which price is left..rigth range and save them in products array
        result.products.forEach((product) => products.push(product));
        Total -= result.total; //decrease the Total value with number of products which we save;
      }

      // because we have every products which's price is less or equal then left, now we start to find products which's price is more then left
      left = right + 1;
      right = 100000;
    }
  } catch (error) {
    console.log("somethig is wrong please check instraction in README.md file");
  }
};

const getInfo = async (minPrice = 0, maxPrice = 100000, returnProducts) => {
  try {
    // fetch response from url
    const response = await fetch(
      url + `?minPrice=${minPrice}&maxPrice=${maxPrice}`
    );

    const body = await response.text();
    const { total, count } = JSON.parse(body);

    // if returnProducts is true this mean, total and count is equal, so we need products array
    if (returnProducts) {
      return JSON.parse(body);
    }

    return { total, count };
  } catch (error) {
    console.log("somethig is wrong please check instraction in README.md file");
  }
};

const writeProducts = (start, end) => {
  for (let index = start; index <= end; index++) {
    console.log(products[index]);
  }
};

const answer = async () => {
  // please see README.md file for running instraction
  console.log("please wait...");

  await findProducts();

  let COMMAND;
  let START = 0;
  let END = 100;

  process.argv.forEach((arg) => {
    if (arg.includes("COMMAND")) COMMAND = arg.split("=")[1];

    if (arg.includes("START")) START = parseInt(arg.split("=")[1]);

    if (arg.includes("END")) END = parseInt(arg.split("=")[1]);
  });

  switch (COMMAND) {
    case "amount": {
      console.log(products.length);
      return;
    }
    case "writeProducts": {
      writeProducts(
        max(parseInt(START), 0),
        min(products.length, parseInt(END))
      );
      return;
    }
    default:
      console.log(
        "to see prodcuts run command npm run writeProducts",
        "You also can give start position and end position like npm run writeProducts START=50 END=321",
        "default position is 0 and 100"
      );
  }
};

answer();
