using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Cnpj = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CostCenters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostCenters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: false),
                    Salary = table.Column<decimal>(type: "numeric", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employees_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Cnpj = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    CNO = table.Column<string>(type: "character varying(12)", maxLength: 12, nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Contractor = table.Column<string>(type: "text", nullable: false),
                    ServiceTaker = table.Column<string>(type: "text", nullable: false),
                    Responsible = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsAdditive = table.Column<bool>(type: "boolean", nullable: false),
                    OriginalProjectId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    ContractNumber = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    TotalValue = table.Column<decimal>(type: "numeric", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SignedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Observations = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contracts_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectEmployees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectEmployees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectEmployees_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectEmployees_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContractInvoices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IssueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    InvoiceNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    GrossValue = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    IssValue = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    InssValue = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    NetValue = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AttachmentPath = table.Column<string>(type: "text", nullable: true),
                    ContractId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractInvoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractInvoices_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectExpenses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsVirtual = table.Column<bool>(type: "boolean", nullable: false),
                    DetailsJson = table.Column<string>(type: "jsonb", nullable: true),
                    ContractId = table.Column<Guid>(type: "uuid", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CostCenterId = table.Column<Guid>(type: "uuid", nullable: false),
                    Observations = table.Column<string>(type: "text", nullable: true),
                    SupplierName = table.Column<string>(type: "text", nullable: true),
                    InvoiceNumber = table.Column<string>(type: "text", nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AttachmentPath = table.Column<string>(type: "text", nullable: true),
                    IsAutomaticallyCalculated = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectExpenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectExpenses_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProjectExpenses_CostCenters_CostCenterId",
                        column: x => x.CostCenterId,
                        principalTable: "CostCenters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectExpenses_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ExpenseAttachment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectExpenseId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    StoredPath = table.Column<string>(type: "text", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpenseAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExpenseAttachment_ProjectExpenses_ProjectExpenseId",
                        column: x => x.ProjectExpenseId,
                        principalTable: "ProjectExpenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "CostCenters",
                columns: new[] { "Id", "CompanyId", "Name" },
                values: new object[,]
                {
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000001"), null, "Alimentação/ mercado" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000002"), null, "Combustível" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000003"), null, "Despesas de aluguel" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000004"), null, "Despesas de luz, água e internet" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000005"), null, "Diesel" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000006"), null, "EPI's e uniformes" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000007"), null, "Exames e Clínicas (admissionais, periódicos, demissionais)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000008"), null, "Farmácia e medicamentos" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000009"), null, "Ferramentas/ ferragens" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000010"), null, "Folhas de pagamento" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000011"), null, "Honorários administrativos" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000012"), null, "Honorários de contabilidade" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000013"), null, "Honorários jurídicos" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000014"), null, "Hospedagens" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000015"), null, "Locação de Container" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000016"), null, "Locação de PTA" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000017"), null, "Locação de Munck/ Guindaste" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000018"), null, "Mecânica e manutenções" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000019"), null, "Passagens de folga de campo" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000020"), null, "Passagens de funcionários (admissão e rescisão)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000021"), null, "Pedágios" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000022"), null, "Serviços de treinamento" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000023"), null, "Folhas de 13º" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000024"), null, "Folhas de Adiantamento Salarial" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000025"), null, "Folhas de férias" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000026"), null, "Serviços de Engenharia (ART, Projetos)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000027"), null, "Tributos (guias de INSS. FGTS, DCTFWeb, Impostos)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000028"), null, "Veículos (multas, licenciamentos, taxas)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000029"), null, "Verbas rescisórias" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractInvoices_ContractId",
                table: "ContractInvoices",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_ProjectId",
                table: "Contracts",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_CompanyId",
                table: "Employees",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpenseAttachment_ProjectExpenseId",
                table: "ExpenseAttachment",
                column: "ProjectExpenseId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectEmployees_EmployeeId",
                table: "ProjectEmployees",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectEmployees_ProjectId",
                table: "ProjectEmployees",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectExpenses_ContractId",
                table: "ProjectExpenses",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectExpenses_CostCenterId",
                table: "ProjectExpenses",
                column: "CostCenterId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectExpenses_ProjectId",
                table: "ProjectExpenses",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CompanyId",
                table: "Projects",
                column: "CompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractInvoices");

            migrationBuilder.DropTable(
                name: "ExpenseAttachment");

            migrationBuilder.DropTable(
                name: "ProjectEmployees");

            migrationBuilder.DropTable(
                name: "ProjectExpenses");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "CostCenters");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Companies");
        }
    }
}
