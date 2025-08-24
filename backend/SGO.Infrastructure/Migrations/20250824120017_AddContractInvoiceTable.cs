using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddContractInvoiceTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractInvoice_Contracts_ContractId",
                table: "ContractInvoice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContractInvoice",
                table: "ContractInvoice");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Employees");

            migrationBuilder.RenameTable(
                name: "ContractInvoice",
                newName: "ContractInvoices");

            migrationBuilder.RenameIndex(
                name: "IX_ContractInvoice_ContractId",
                table: "ContractInvoices",
                newName: "IX_ContractInvoices_ContractId");

            migrationBuilder.AlterColumn<Guid>(
                name: "ContractId",
                table: "ContractInvoices",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AttachmentPath",
                table: "ContractInvoices",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DeductionsValue",
                table: "ContractInvoices",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "DepositDate",
                table: "ContractInvoices",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "GrossValue",
                table: "ContractInvoices",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "NetValue",
                table: "ContractInvoices",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "ContractInvoices",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContractInvoices",
                table: "ContractInvoices",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractInvoices_Contracts_ContractId",
                table: "ContractInvoices",
                column: "ContractId",
                principalTable: "Contracts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractInvoices_Contracts_ContractId",
                table: "ContractInvoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContractInvoices",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "AttachmentPath",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "DeductionsValue",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "DepositDate",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "GrossValue",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "NetValue",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "ContractInvoices");

            migrationBuilder.RenameTable(
                name: "ContractInvoices",
                newName: "ContractInvoice");

            migrationBuilder.RenameIndex(
                name: "IX_ContractInvoices_ContractId",
                table: "ContractInvoice",
                newName: "IX_ContractInvoice_ContractId");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Employees",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<Guid>(
                name: "ContractId",
                table: "ContractInvoice",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContractInvoice",
                table: "ContractInvoice",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractInvoice_Contracts_ContractId",
                table: "ContractInvoice",
                column: "ContractId",
                principalTable: "Contracts",
                principalColumn: "Id");
        }
    }
}
