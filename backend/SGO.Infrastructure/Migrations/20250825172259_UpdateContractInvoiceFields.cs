using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContractInvoiceFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "ContractInvoices");

            migrationBuilder.RenameColumn(
                name: "DepositDate",
                table: "ContractInvoices",
                newName: "PaymentDate");

            migrationBuilder.RenameColumn(
                name: "DeductionsValue",
                table: "ContractInvoices",
                newName: "IssValue");

            migrationBuilder.AddColumn<decimal>(
                name: "InssValue",
                table: "ContractInvoices",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "InvoiceNumber",
                table: "ContractInvoices",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "IssueDate",
                table: "ContractInvoices",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InssValue",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "InvoiceNumber",
                table: "ContractInvoices");

            migrationBuilder.DropColumn(
                name: "IssueDate",
                table: "ContractInvoices");

            migrationBuilder.RenameColumn(
                name: "PaymentDate",
                table: "ContractInvoices",
                newName: "DepositDate");

            migrationBuilder.RenameColumn(
                name: "IssValue",
                table: "ContractInvoices",
                newName: "DeductionsValue");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "ContractInvoices",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
