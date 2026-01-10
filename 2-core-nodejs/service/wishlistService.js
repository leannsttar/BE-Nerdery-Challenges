const path = require("node:path");
const fs = require("node:fs/promises");
const { fetchData, saveData } = require("../repository/itemRepository.js")
const { reset, green } = require("../helpers/colors")


async function addItem(name, price, store) {
  try {
    const data = await fetchData();

    let id;
    if (data.length < 1) {
      id = 1;
    } else {
      const IDs = data.map((product) => product.id);
      id = Math.max(...IDs) + 1;
    }

    const priceConvertedToNumber = parseFloat(price);

    data.push({
      id,
      name,
      price: priceConvertedToNumber,
      store,
    });

    await saveData(data);

    console.log(`\n${green}Item added successfully!${reset}\n`);
  } catch (error) {
    console.log(`An error has ocurred: ${error}`);
  }
}

async function viewItems() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function editItem(id, name, price, store) {
  try {
    const data = await fetchData();
    const item = data.find((i) => i.id == id);

    if (!item) {
      console.log("\nItem not found.");
      return;
    }

    if (name && name.trim()) item.name = name.trim();
    if (price && price.trim()) item.price = parseFloat(price);
    if (store && store.trim()) item.store = store.trim();

    await saveData(data);

    console.log(`\n${green}Item updated successfully!${reset}\n`);
  } catch (error) {
    console.log(error);
  }
}

async function deleteItem(id) {
  try {
    const data = await fetchData();
    const newData = data.filter((item) => item.id !== id);

    await saveData(newData);

    console.log(`\n${green}Item deleted successfully!${reset}\n`);
  } catch (error) {
    console.log(error);
  }
}

async function exportToCsv() {
  try {
    const data = await fetchData();

    const folderForExports = path.join(__dirname, "..", "exports");
    const uniqueIdentifier = Date.now()
    const fileName = `wishlist_export_${uniqueIdentifier}.csv`
    const filePath = path.join(folderForExports, fileName);

    let dataForCsv = '';
    const columns = Object.keys(data[0]).join(',') + '\n'
    dataForCsv+= columns
    data.forEach((item) => {
      dataForCsv+= Object.values(item).join(',') + '\n'
    })
    
    await fs.writeFile(filePath, dataForCsv)

    console.log(`\n${green}Data exported successfully on /exports!${reset}\n`);

  } catch (error) {
    console.log(error);
  }
}

async function summary() {
  const data = await fetchData()

  const mostExpensive = data.reduce((prev, current) => {
    return (parseFloat(prev.price) > parseFloat(current.price)) ? prev : current;
  });

  const totalCost = data.reduce((acc, item) => acc + parseFloat(item.price), 0);
  const averagePrice = totalCost / data.length;
  const numberOfItems = data.length

  console.log(` 
  Total items:          ${numberOfItems}
  Total cost:         $${totalCost.toFixed(2)}
  Average price:        $${averagePrice.toFixed(2)}
  Most expensive item:  ${mostExpensive.name} ($${parseFloat(mostExpensive.price).toFixed(2)})
  `);
}

module.exports = {
  addItem,
  viewItems,
  editItem,
  deleteItem,
  exportToCsv,
  summary
};
