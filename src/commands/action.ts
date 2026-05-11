import { SlashCommandBuilder, ChatInputCommandInteraction, User, AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Command, Color } from "./../utils/config"
import fs from "fs"

interface ActionReplies {
    targetted?: string[]
    unspecified: string[]
}

export const Action: Command = {
    data: new SlashCommandBuilder()
        .setName("action")
        .setDescription("Perform an action.")
        .setContexts([0, 1, 2])

        .addSubcommand(subcommand => subcommand
            .setName("kiss")
            .setDescription("Kiss someone.")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to kiss.")
                .setRequired(false)
            )
        )

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

        const user: User = interaction.user
        const target: User | null = interaction.options.getUser("target") ?? null

        const action_replies: ActionReplies = JSON.parse(fs.readFileSync(`src/source/action/${subcommand}.json`, "utf-8"))
        let reply: string

        if (target && action_replies.targetted) reply = action_replies.targetted[Math.floor(Math.random() * action_replies.targetted.length)]
        else reply = action_replies.unspecified[Math.floor(Math.random() * action_replies.unspecified.length)]

        reply = reply.replace("<user>", `**${user.displayName}**`)
        if (target) reply = reply.replace("<target>", `**${target.displayName}**`)

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle(reply)

        await interaction.reply({ embeds: [embed] })
    }
}
