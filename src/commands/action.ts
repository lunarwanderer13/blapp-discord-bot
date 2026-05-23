import { SlashCommandBuilder, ChatInputCommandInteraction, User, AttachmentBuilder, EmbedBuilder } from "discord.js"
import { fetchRandom, NbIndividualResponse, NbCategories } from "nekos-best.js"
import { Command, Color, sendError } from "./../utils/config"
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
            .setName("blush")
            .setDescription("Show embarrassment.")
        )

        .addSubcommand(subcommand => subcommand
            .setName("hug")
            .setDescription("Hug someone.")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to hug.")
                .setRequired(false)
            )
        )

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
            .setName("pat")
            .setDescription("Pat someone.")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to pat.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("punch")
            .setDescription("Punch someone.")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to punch.")
                .setRequired(false)
            )
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand: string = interaction.options.getSubcommand()

        const user: User = interaction.user
        const target: User | null = interaction.options.getUser("target") ?? null

        const gif: NbIndividualResponse = (await fetchRandom(subcommand as NbCategories)).results[0]

        if (!gif) {
            sendError(interaction, "GIF not found")
            return
        }

        const attchment: AttachmentBuilder = new AttachmentBuilder(gif.url, { name: `${subcommand}.gif` })

        const action_replies: ActionReplies = JSON.parse(fs.readFileSync(`src/source/action/${subcommand}.json`, "utf-8"))
        let reply: string

        if (target && action_replies.targetted) reply = action_replies.targetted[Math.floor(Math.random() * action_replies.targetted.length)]
        else reply = action_replies.unspecified[Math.floor(Math.random() * action_replies.unspecified.length)]

        reply = reply.replace("<user>", `**${user.displayName}**`)
        if (target) reply = reply.replace("<target>", `**${target.displayName}**`)

        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle(reply)
            .setImage(`attachment://${subcommand}.gif`)

        if (gif.artist_name) embed.setAuthor({ name: `Artist: ${gif.artist_name}` })
        if (gif.artist_name && gif.artist_href) embed.setAuthor({ name: `Artist: ${gif.artist_name}`, url: gif.artist_href })
        if (gif.anime_name) embed.setFooter({ text: `Anime: ${gif.anime_name}`})

        await interaction.reply({ embeds: [embed], files: [attchment] })
    }
}
