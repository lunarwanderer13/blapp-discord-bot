import { Client, REST, Routes } from "discord.js"
import { Commands } from "./../index"
import "dotenv/config"

export default (client: Client): void => {
    client.on("clientReady", async () => {
        if (!client.user || !client.application) {
            return
        }

        const rest = new REST().setToken(process.env.TOKEN!)
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), { body: Commands.map(command => command.data.toJSON()) })

        console.log(`Logged in as ${client.user.username}`)
    })
}