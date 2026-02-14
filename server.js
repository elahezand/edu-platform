const app = require("./app")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("server Connected Successfully:)"))
    .catch((err) => console.log(err))

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`);

})