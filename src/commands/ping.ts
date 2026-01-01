import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import { Command } from "./../index"

export const Ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: `Pong!`,
            flags: MessageFlags.Ephemeral
        })
    }
}