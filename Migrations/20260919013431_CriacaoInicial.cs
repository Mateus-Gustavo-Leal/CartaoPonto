using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cartao_Ponto.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RegistrosPonto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UsuarioId = table.Column<int>(type: "INTEGER", nullable: false),
                    Data = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Entrada = table.Column<DateTime>(type: "TEXT", nullable: true),
                    InicioIntervalo = table.Column<DateTime>(type: "TEXT", nullable: true),
                    FimIntervalo = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Saida = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosPonto", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistrosPonto");
        }
    }
}
