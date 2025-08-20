namespace SGO.Core;

// --- Enums de Suporte ---

public enum ContractStatus
{
    Draft = 1,      // Rascunho
    Active = 2,     // Ativo
    Completed = 3,  // Concluído
    Cancelled = 4   // Cancelado
}

public enum ExpenseStatus
{
    Pending = 1,    // Pendente
    Approved = 2,   // Aprovada
    Paid = 3,       // Paga
    Rejected = 4    // Rejeitada
}


// --- Entidades de Suporte ---

// Classe placeholder para faturas. Será detalhada no futuro.
public class ContractInvoice
{
    public Guid Id { get; set; }
    // Outras propriedades como Número, Valor, Data de Vencimento, etc.
}

// Classe para representar os anexos de uma despesa.
public class ExpenseAttachment
{
    public Guid Id { get; set; }
    public Guid ProjectExpenseId { get; set; } // Chave estrangeira
    public string FileName { get; set; } = default!;
    public string StoredPath { get; set; } = default!;
    public DateTime UploadedAt { get; set; }
}