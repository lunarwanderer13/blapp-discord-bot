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
            .setName("poke")
            .setDescription("Poke someone.")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to poke.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("pout")
            .setDescription("Show annoyance.")
        )

        .addSubcommand(subcommand => subcommand
            .setName("punch")
            .setDescription("Punch someone.")

            .addUserOption(option => option
                .setName("target")
                .setDescription("User to punch.")
                .setRequired(false)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName("smug")
            .setDescription("Show confidence.")
        )

        .addSubcommand(subcommand => subcommand
            .setName("yawn")
            .setDescription("Show exhaustion.")
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        // Get the requested action to execute
        const subcommand: string = interaction.options.getSubcommand()

        const user: User = interaction.user // The person executing the command
        const target: User | null = interaction.options.getUser("target") ?? null // The person being targetted by the command (optional)

        // Gif returned by the nekos-best.js API
        const gif: NbIndividualResponse = (await fetchRandom(subcommand as NbCategories)).results[0]

        // Make sure the response is valid
        if (!gif) {
            sendError(interaction, "GIF not found")
            return
        }

        // Turn the gif into a discord attachment
        const attchment: AttachmentBuilder = new AttachmentBuilder(gif.url, { name: `${subcommand}.gif` })

        // Get a randomized reply to the action
        const action_replies: ActionReplies = JSON.parse(fs.readFileSync(`src/source/action/${subcommand}.json`, "utf-8"))
        let reply: string

        if (target && action_replies.targetted) reply = action_replies.targetted[Math.floor(Math.random() * action_replies.targetted.length)]
        else reply = action_replies.unspecified[Math.floor(Math.random() * action_replies.unspecified.length)]

        // Replace reply tags with the user and target
        reply = reply.replace("<user>", `**${user.displayName}**`)
        if (target) reply = reply.replace("<target>", `**${target.displayName}**`)

        // Discord embed to be sent
        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(Color.primary)
            .setTitle(reply)
            .setImage(`attachment://${subcommand}.gif`)

        // Gif credit info
        if (gif.artist_name) embed.setAuthor({ name: `Artist: ${gif.artist_name}` })
        if (gif.artist_name && gif.artist_href) embed.setAuthor({ name: `Artist: ${gif.artist_name}`, url: gif.artist_href })
        if (gif.anime_name) embed.setFooter({ text: `Anime: ${gif.anime_name}`})

        // Send the reply
        await interaction.reply({ embeds: [embed], files: [attchment] })
    }
}
