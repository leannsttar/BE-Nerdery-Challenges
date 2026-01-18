const { ask, rl } = require("../helpers/askQuestion.js");
const { reset, cyan, bold, yellow } = require("../helpers/colors");

const {
  addItem,
  viewItems,
  editItem,
  deleteItem,
  exportToCsv,
  summary,
} = require("../service/wishlistService.js");

async function handleViewItems() {
  console.log(`${cyan}${bold}--------------- My Items -----------------${reset}\n`);
  const data = await viewItems();
  console.table(data);
}

async function handleAddItem() {
  console.log(`${cyan}${bold}--------------- Adding an Item -----------------${reset}\n`);

  // Validation for name
  let name = await ask("Type the name: ");
  while (name.trim() === "") {
    console.log("Invalid input. Name cannot be empty.");
    name = await ask("Type the name: ");
  }

  // validation for price
  let price = await ask("Type the price: ");
  while (isNaN(parseFloat(price)) || price.trim() === "") {
    console.log("Invalid input. Please enter a valid number for the price.");
    price = await ask("Type the price: ");
  }

  // validation for store
  let store = await ask("Type the store: ");
  while (store.trim() === "") {
    console.log("Invalid input. Store cannot be empty.");
    store = await ask("Type the store: ");
  }

  await addItem(name, price, store);
}

async function handleEditItem() {
  console.log(`${cyan}${bold}--------------- Editing an Item -----------------${reset}\n`);
  const data = await viewItems();
  console.table(data);

  const id = await ask("Type the id to edit: ");
  const itemToEdit = data.find((item) => item.id == id);
  console.log("\n");

  if (itemToEdit) {
    console.log(`${yellow}****If you dont wanna change something, leave it blank***${reset} \n`);
    const name = await ask(`Name (${itemToEdit.name}): `);

    let price = await ask(`Price (${itemToEdit.price}): `);
    while (price.trim() !== "" && isNaN(parseFloat(price))) {
      console.log("Invalid input. Please enter a number or leave it blank.");
      price = await ask(`Price (${itemToEdit.price}): `);
    }

    const store = await ask(`Store (${itemToEdit.store}): `);

    await editItem(id, name, price, store);
  } else {
    console.log("ID not found.");
  }
}

async function handleDeleteItem() {
  console.log(`${cyan}${bold}--------------- Deleting an Item -----------------${reset}\n`);
  const data = await viewItems();
  console.table(data);

  // Validation for ID (number)
  let id = await ask("Type the id to delete: ");
  while (id.trim() === "" || isNaN(parseInt(id))) {
    console.log("Invalid input. Please enter a valid ID number.");
    id = await ask("Type the id to delete: ");
  }

  const itemToDelete = data.find((item) => item.id == id);
  console.log("\n");

  if (itemToDelete) {
    await deleteItem(itemToDelete.id);
  } else {
    console.log("Item not found.");
  }
}

async function run() {
  let isContinue = true;

  do {
    try {
      console.log(`${cyan}${bold}--------------- MY WISHLIST -----------------${reset}\n`);
      console.log(`
      1 - View my items
      2 - Add an item
      3 - Edit an item
      4 - Remove an item
      5 - Export csv
      6 - Summary
      7 - Exit\n`);

      let option = await ask("Type the number of your option: ");
      console.log("\n");

      switch (option) {
        case "1": await handleViewItems(); break;
        case "2": await handleAddItem(); break;
        case "3": await handleEditItem(); break;
        case "4": await handleDeleteItem(); break;
        case "5": await exportToCsv(); break;
        case "6":
          console.log(`${cyan}${bold}--------------- WISHLIST SUMMARY -----------------${reset}\n`);
          await summary();
          break;
        case "7":
          isContinue = false;
          console.log("Goodbye!");
          rl.close();
          break;
        default:
          console.log("Choose an available option\n");
          break;
      }
    } catch (error) {
      console.log(`${red}${bold}⚠️  ERROR:${reset} ${error.message}\n`);
    }

    if (isContinue) {
      await ask("Press enter to return to the menu");
    }
  } while (isContinue);
}
module.exports = {
  run,
};