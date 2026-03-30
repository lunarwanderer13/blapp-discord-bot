import { SlashCommandBuilder, ChatInputCommandInteraction, User, AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Command, Color } from "./../utils/config"
import fs from "fs"

export const Action: Command = {
    data: new SlashCommandBuilder()
        .setName("action")
        .setDescription("Perform an action.")
        .setContexts([0, 1, 2])

        .addSubcommand(subcommand => subcommand
            .setName("pet")
            .setDescription("Pet someone.")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to pet.")
                .setRequired(false)
            )
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand: string = interaction.options.getSubcommand()
        const target: User | null = interaction.options.getUser("target") ?? null

        switch(subcommand) {
            case "pet":
                const pet_embed: EmbedBuilder = new EmbedBuilder()
                    .setColor(Color.primary)

                if (target) pet_embed.setTitle(`${interaction.user} pets ${target}!`)
                else pet_embed.setTitle(`${interaction.user} pets you!`)

                await interaction.reply({ embeds: [pet_embed] })
                break
            case "kiss":
                const kiss_embed: EmbedBuilder = new EmbedBuilder()
                    .setColor(Color.primary)

                if (target) kiss_embed.setTitle(`${interaction.user} kisses ${target}!`)
                else kiss_embed.setTitle(`${interaction.user} kisses you!`)

                await interaction.reply({ embeds: [kiss_embed] })
                break
        }
    }
}
