const { run } = require("./controller/wishlistController.js");

async function main() {
    try {
        await run()
    } catch (error) {
        console.log(error)
    }
}

main()