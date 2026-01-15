import { SlashCommandBuilder, ChatInputCommandInteraction, User, EmbedBuilder, MessageFlags, Embed } from "discord.js"
import { Command, Color } from "./../utils/config"

export const Avatar: Command = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Get the avatar of a user.")
        .setContexts([0, 1, 2])

        .addUserOption(option => option
            .setName("user")
            .setDescription("User whose avatar to get.")
            .setRequired(true)
        )
        
        .addBooleanOption(option => option
            .setName("hidden")
            .setDescription("Whether the message should be hidden or not.")
            .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const user: User | null = interaction.options.getUser("user")
        const hidden: boolean = interaction.options.getBoolean("hidden") ?? false

        if (user) {
            const avatar_embed: EmbedBuilder = new EmbedBuilder()
                .setColor(Color.primary)
                .setTitle(`${user.username}'s avatar`)
                .setImage(user.avatarURL())

            if (!hidden) {
                await interaction.reply({ embeds: [avatar_embed] })
            } else {
                await interaction.reply({ embeds: [avatar_embed], flags: MessageFlags.Ephemeral })
            }
        } else {
            const error_embed: EmbedBuilder = new EmbedBuilder()
                .setColor(Color.accent)
                .setTitle("No user found")
                .setDescription("I wasn't able to find the user you requested, are you sure it's not your schizo gf?")

            await interaction.reply({ embeds: [error_embed], flags: MessageFlags.Ephemeral })
        }
    }
}