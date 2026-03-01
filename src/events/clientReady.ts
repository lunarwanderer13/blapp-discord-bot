import { Client, REST, Routes, User } from "discord.js"
import { Commands } from "./../index"
import "dotenv/config"

export default (client: Client): void => {
    client.on("clientReady", async () => {
        if (!client.user || !client.application) return

        const app: User = client.user
        const restart: boolean = false
        const rest: REST = new REST().setToken(process.env.TOKEN!)

        if (restart) {
            // Remove global commands
            await rest.put(Routes.applicationCommands(app.id),  { body: [] })

            // Remove guild commands
            client.guilds.cache.forEach(async guild => {
                await rest.put(Routes.applicationGuildCommands(app.id, guild.id), { body: [] })
            })
        }

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: Commands.map(command => command.data.toJSON()) })

        console.log(`Logged in as ${client.user.username}`)
    })
}