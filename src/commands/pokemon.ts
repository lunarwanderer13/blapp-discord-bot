import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { MainClient, Pokemon } from "pokenode-ts"
import { Command, Color, sendError } from "./../utils/config"

const poke_api: MainClient = new MainClient()

export const Pokewiki: Command = {
    data: new SlashCommandBuilder()
        .setName("pokedex")
        .setDescription("Get pokemon info.")
        .setContexts([0, 1, 2])

        .addSubcommand(subcommand => subcommand
            .setName("pokemon")
            .setDescription("Get info about a pokemon.")

            .addStringOption(option => option
                .setName("name")
                .setDescription("The name of the pokemon.")
                .setRequired(true)
            )

            .addBooleanOption(option => option
                .setName("shiny")
                .setDescription("If the pokemon is shiny or not.")
                .setRequired(false)
            )

            .addBooleanOption(option => option
                .setName("hidden")
                .setDescription("Whether the message should be hidden or not.")
                .setRequired(false)
            )
        ),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand: string = interaction.options.getSubcommand()
        const hidden: boolean = interaction.options.getBoolean("hidden") ?? false

        switch (subcommand) {
            case "pokemon":
                const name: string = interaction.options.getString("name") ?? "Ditto"
                const shiny: boolean = interaction.options.getBoolean("shiny") ?? false
                
                // Check if the pokemon of that name exists
                let pokemon: Pokemon
                try {
                    pokemon = await poke_api.pokemon.getPokemonByName(name)
                } catch {
                    await sendError(interaction, "A pokemon of that name does not exist!")
                    break
                }

                const pokemon_embed: EmbedBuilder = new EmbedBuilder()
                    .setColor(Color.primary)
                    .setTitle(`#${String(pokemon.id).padStart(3, "0")} - ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`)

                if (shiny) pokemon_embed.setThumbnail(pokemon.sprites.front_shiny)
                else pokemon_embed.setThumbnail(pokemon.sprites.front_default)

                if (!hidden) await interaction.reply({ embeds: [pokemon_embed] })
                else await interaction.reply({ embeds: [pokemon_embed], flags: MessageFlags.Ephemeral })
                break
        }
    }
}
