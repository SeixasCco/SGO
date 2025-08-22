using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldsToContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfPeople",
                table: "ProjectExpenses");

            migrationBuilder.AddColumn<string>(
                name: "Observations",
                table: "Contracts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Observations",
                table: "Contracts");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfPeople",
                table: "ProjectExpenses",
                type: "integer",
                nullable: true);
        }
    }
}
