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

public class ContractInvoice
{
    public Guid Id { get; set; }
   
}


public class ExpenseAttachment
{
    public Guid Id { get; set; }
    public Guid ProjectExpenseId { get; set; }
    public string FileName { get; set; } = default!;
    public string StoredPath { get; set; } = default!;
    public DateTime UploadedAt { get; set; }
}