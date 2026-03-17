import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { Command, Color } from "./../utils/config"
import { execSync } from 'child_process'

export const Neofetch: Command = {
    data: new SlashCommandBuilder()
        .setName("neofetch")
        .setDescription("display system information of the maschine running this bot")
        .setContexts([0, 1, 2])

    .addBooleanOption(option => option
        .setName("hidden")
        .setDescription("Whether the message should be hidden or not.")
        .setRequired(false)
    ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
	const hidden: boolean = interaction.options.getBoolean("hidden") ?? false

        let stdout: string = execSync('fastfetch --pipe true').toString()
        stdout = stdout.replace(/.\[../, "")
        stdout = stdout.replace(/.\[.../, "\n\n")
        stdout = stdout.replace(/.\[...m?|\[./gm, "")

        const neofetch_embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle(`$ fastfetch --pipe true`)
            .setDescription(`\`\`\`\n${stdout}\n\`\`\``)
        if (!hidden) {
            await interaction.reply({ embeds: [neofetch_embed] })
        } else {
            await interaction.reply({ embeds: [neofetch_embed], flags: MessageFlags.Ephemeral })
        }
    }
}
